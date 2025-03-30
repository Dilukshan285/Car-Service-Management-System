import User from "../models/Usermodel.js";
import { hashSync, compareSync, compare, hash } from "bcrypt";
import sendMail from "../middleware/sendMail.js";
import errorHandler from "../utils/error.js";
import multer, { memoryStorage } from "multer";
import sharp from "sharp";
import TempUserStore from "../middleware/tempUserStore.js";
import convertImageToBase64 from "../middleware/Base64.js";
import jwt from "jsonwebtoken";

// Destructure the functions from TempUserStore
const { storeTempUser, getTempUser, clearTempUser } = TempUserStore;

// Configure multer storage to store files in memory
const storage = memoryStorage();
const upload = multer({ storage }).single("avatar");

// New User Registration
const signup = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(errorHandler(500, "File upload error"));
    }

    try {
      const { first_name, last_name, email, password } = req.body;

      // Check if a user with the given email already exists
      const normalizedEmail = email.toLowerCase();

      let existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return next(errorHandler(400, "User Email Already Exists"));
      }

      const defaultAvatarURL =
        "https://tse2.mm.bing.net/th?id=OIP.eCrcK2BiqwBGE1naWwK3UwHaHa&pid=Api&P=0&h=180";
      let avatarBase64;

      // If the user has uploaded an avatar, compress and convert to Base64
      if (req.file) {
        try {
          const compressedImageBuffer = await sharp(req.file.buffer)
            .resize(300, 300) // Resize to 300x300 pixels
            .jpeg({ quality: 80 }) // Compress to 80% quality
            .toBuffer();
          avatarBase64 = `data:${req.file.mimetype};base64,${compressedImageBuffer.toString("base64")}`;
        } catch (imageError) {
          console.error("Error compressing image:", imageError);
          return next(errorHandler(500, "Image processing error"));
        }
      } else {
        avatarBase64 = defaultAvatarURL;
      }

      // Hash the user's password
      const hashedPassword = hashSync(password, 10);

      // Generate a 6-digit OTP and hash it
      let otp = Math.floor(100000 + Math.random() * 900000);
      const hashedOtp = hashSync(otp.toString(), 10);

      // Temporarily store OTP and other data
      const tempUserData = {
        avatar: avatarBase64,
        first_name,
        last_name,
        email: normalizedEmail,
        hashedPassword,
        hashedOtp,
        otpExpiresAt: Date.now() + 2.3 * 60 * 1000, // OTP expires in 3 minutes
      };
      storeTempUser(req, tempUserData);

      console.log("Session Data at Signup:", tempUserData);

      // Send an email to the user with the OTP
      const message = `
        <div style="text-align: center;">
          <h2>Welcome to Revup Car Services </h2>
          <p>Please verify your account using the following OTP:</p>
          <h1 style="font-size: 2em; font-weight: bold;">${otp}</h1>
        </div>
      `;
      await sendMail(email, "Welcome to Revup Car Services", message);

      return res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
      console.error("Signup Error:", error);
      next(error);
    }
  });
};

// OTP Verification
const verifyUser = async (req, res, next) => {
  try {
    const { otp } = req.body;

    console.log("Received OTP:", otp);
    console.log("Session Data at Verification:", req.session);

    const tempUser = getTempUser(req);

    if (!tempUser) {
      console.log(
        "Session Data Missing. Likely session has expired or wasn't stored correctly."
      );
      return next(errorHandler(400, "Session expired or User not found"));
    }

    if (Date.now() > tempUser.otpExpiresAt) {
      return next(
        errorHandler(401, "OTP has expired. Click Resend Button To Get OTP")
      );
    }

    const isOtpValid = compareSync(otp.toString(), tempUser.hashedOtp);

    if (!isOtpValid) {
      return next(errorHandler(402, "Invalid OTP"));
    }

    const newUser = new User({
      avatar: tempUser.avatar,
      first_name: tempUser.first_name,
      last_name: tempUser.last_name,
      email: tempUser.email,
      password: tempUser.hashedPassword,
    });

    await newUser.save();

    clearTempUser(req);

    return res.status(200).json({ message: "User Registration Success" });
  } catch (error) {
    console.error("Verify User Error:", error);
    next(error);
  }
};

const resendOtp = async (req, res, next) => {
  try {
    const tempUser = getTempUser(req);

    if (!tempUser) {
      return next(errorHandler(400, "Session expired or User not found"));
    }

    const email = tempUser.email;

    // Generate a new 6-digit OTP and hash it
    let otp = Math.floor(100000 + Math.random() * 900000);
    const hashedOtp = hashSync(otp.toString(), 10);

    // Update the session with the new OTP and expiry time
    tempUser.hashedOtp = hashedOtp;
    tempUser.otpExpiresAt = Date.now() + 2.3 * 60 * 1000; // OTP expires in 2.30 minutes
    storeTempUser(req, tempUser);

    console.log("New OTP generated:", otp);

    // Send an email to the user with the new OTP
    const message = `
      <div style="text-align: center;">
        <h2>Welcome to Revup car service Pvt Ltd</h2>
        <p>Your new OTP is:</p>
        <h1 style="font-size: 2em; font-weight: bold;">${otp}</h1>
      </div>
    `;
    await sendMail(email, "Your New OTP for Revup car service Pvt Ltd", message);

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    next(error);
  }
};

// Sign In
const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    console.log("Request Body:", req.body);
    const normalizedEmail = email.toLowerCase();

    const validUser = await User.findOne({ email: normalizedEmail });
    if (!validUser) {
      return next(errorHandler(404, "Invalid Credentials"));
    }

    console.log("Found User:", validUser);
    const validPassword = await compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(405, "Invalid Credentials"));
    }

    validUser.status = "active";
    validUser.lastLogin = new Date();
    await validUser.save();

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: pass, ...rest } = validUser._doc;

    // Set the cookie without maxAge (becomes a session cookie)
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    console.log("Response Data:", rest);
    res.status(200).json(rest);
  } catch (error) {
    console.error("Signin Error:", error);
    next(error);
  }
};

const google = async (req, res, next) => {
  const { first_name, last_name, email, googlePhotoUrl } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      user.status = "active";
      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;

      // Set the cookie without maxAge (becomes a session cookie)
      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = hashSync(generatedPassword, 10);

      let avatarUrl = null;
      if (googlePhotoUrl && googlePhotoUrl.startsWith("https")) {
        try {
          avatarUrl = await convertImageToBase64(googlePhotoUrl);
          console.log("Converted avatar to base64:", avatarUrl.substring(0, 50));
        } catch (conversionError) {
          console.error("Failed to convert image to base64:", conversionError);
          avatarUrl = "https://tse2.mm.bing.net/th?id=OIP.eCrcK2BiqwBGE1naWwK3UwHaHa&pid=Api&P=0&h=180";
        }
      }

      const newUser = new User({
        first_name,
        last_name,
        email,
        status: "active",
        lastLogin: new Date(),
        password: hashedPassword,
        avatar: avatarUrl,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;

      // Set the cookie without maxAge (becomes a session cookie)
      return res
        .status(201)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .json(rest);
    }
  } catch (error) {
    console.error("Google Signin Error:", error);
    next(error);
  }
};

const requestOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (!existingUser) {
      return next(errorHandler(404, "User not found"));
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedOtp = hashSync(otp.toString(), 10);

    const tempUserData = {
      email,
      hashedOtp,
      otpExpiresAt: Date.now() + 2.3 * 60 * 1000, // OTP expires in 3 minutes
    };
    storeTempUser(req, tempUserData);

    const message = `
      <div style="text-align: center;">
        <h2>Password Reset Request</h2>
        <p>Please use the following OTP to reset your password:</p>
        <h1 style="font-size: 2em; font-weight: bold;">${otp}</h1>
      </div>
    `;
    await sendMail(email, "Password Reset Request", message);

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Request OTP Error:", error);
    next(error);
  }
};

// Forgot Password - Verify OTP
const verifyOtpForPasswordReset = async (req, res, next) => {
  try {
    const { otp } = req.body;

    const tempUser = getTempUser(req);
    if (!tempUser) {
      return next(errorHandler(400, "Session expired or User not found"));
    }

    if (Date.now() > tempUser.otpExpiresAt) {
      return next(errorHandler(401, "OTP has expired"));
    }

    const isOtpValid = compareSync(otp.toString(), tempUser.hashedOtp);
    if (!isOtpValid) {
      return next(errorHandler(402, "Invalid OTP"));
    }

    return res
      .status(200)
      .json({ message: "OTP verified. Proceed to reset password." });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    next(error);
  }
};

const recovery_resendOTP = async (req, res, next) => {
  try {
    const tempUser = getTempUser(req);

    if (!tempUser) {
      return next(errorHandler(400, "Session expired or User not found"));
    }

    const email = tempUser.email;

    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedOtp = hashSync(otp.toString(), 10);

    tempUser.hashedOtp = hashedOtp;
    tempUser.otpExpiresAt = Date.now() + 2.3 * 60 * 1000; // OTP expires in 2.5 minutes
    storeTempUser(req, tempUser);

    console.log("New OTP generated:", otp);

    const message = `
      <div style="text-align: center;">
        <h2>Password Recovery</h2>
        <p>Please use the following OTP to reset your password:</p>
        <h1 style="font-size: 2em; font-weight: bold;">${otp}</h1>
      </div>
    `;
    await sendMail(email, "Password Recovery OTP", message);

    return res.status(200).json({ message: "OTP resent to your email" });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    next(error);
  }
};

// Forgot Password - Reset Password
const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    const tempUser = getTempUser(req);
    if (!tempUser) {
      return next(errorHandler(400, "Session expired or User not found"));
    }

    const hashedPassword = hashSync(password, 10);

    await User.updateOne({ email: tempUser.email }, { password: hashedPassword });

    clearTempUser(req);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    next(error);
  }
};

const add_employee = async (req, res, next) => {
  try {
    const { first_name, last_name, email, mobile, role } = req.body;

    const normalizedEmail = email.toLowerCase();

    let existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return next(errorHandler(400, "User Email Already Exists"));
    }

    let existingUserByMobile = await User.findOne({ mobile });
    if (existingUserByMobile) {
      return next(errorHandler(401, "Mobile Number Already Exists"));
    }

    const generatedPassword = `${first_name}@1234`;

    const hashedPassword = await hash(generatedPassword, 10);

    const newUser = new User({
      first_name,
      last_name,
      email: normalizedEmail,
      mobile,
      role,
      password: hashedPassword,
    });

    await newUser.save();

    const subject = "Your Employee Account Details";
    const htmlContent = `
      <p>Hello ${first_name},</p>
      <p>Your employee account has been created with the role of <b>${role}</b>. Below are your login details:</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Password:</b> ${generatedPassword}</p>
      <p>Please change your password by using the "Forgot Password" option. Do not share your login credentials with anyone.</p>
      <p>Best regards,</p>
      <p>The Admin Team</p>
    `;

    await sendMail(normalizedEmail, subject, htmlContent);

    res
      .status(201)
      .json({ message: "Employee added successfully, email sent." });
  } catch (error) {
    console.error("Add Employee Error:", error);
    next(error);
  }
};

const login_employee = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const normalizedEmail = email.toLowerCase();

    const emailStatusMap = {
      "gspuser2002@gmail.com": 900,
      "prathioffcut@gmail.com": 901,
      "dumindu.qualityassurance@gmail.com": 902,
      "hiranvehiclefleet@gmail.com": 903,
      "senath.inventory@gmail.com": 904,
      "dilakshanorder728@gmail.com": 905,
      "sujeevandelivery@gmail.com": 906,
      "praveen.farmermgt@gmail.com": 907,
      "senath.inventorymanager@gmail.com": 908,
      "praveengspadlayout@gmail.com": 909,
    };

    let user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return next(errorHandler(400, "Invalid email or password."));
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return next(errorHandler(400, "Invalid email or password."));
    }

    if (user.role !== role) {
      return next(errorHandler(400, "Invalid role selection."));
    }

    user.status = "active";
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: pass, ...rest } = user._doc;

    let statusCode = emailStatusMap[normalizedEmail] || 200;

    // Set the cookie without maxAge (becomes a session cookie)
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(statusCode).json(rest);
  } catch (error) {
    console.error("Login Employee Error:", error);
    next(error);
  }
};

export default {
  signup,
  verifyUser,
  resendOtp,
  signin,
  google,
  requestOtp,
  verifyOtpForPasswordReset,
  recovery_resendOTP,
  resetPassword,
  add_employee,
  login_employee,
};