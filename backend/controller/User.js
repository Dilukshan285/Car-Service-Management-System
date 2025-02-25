import User from "../models/Usermodel.js";
import { hashSync, compareSync, compare, hash } from "bcrypt";
import sendMail from "../middleware/sendMail.js";
import errorHandler from "../utils/error.js";
import multer, { memoryStorage } from "multer";
import sharp from "sharp";
import TempUserStore from "../middleware//tempUserStore.js"; // Corrected path and default import
import convertImageToBase64 from "../middleware/Base64.js";

// Destructure the functions from TempUserStore
const { storeTempUser, getTempUser, clearTempUser } = TempUserStore;

// Configure multer storage to store files in memory
const storage = memoryStorage();
const upload = multer({ storage }).single("avatar"); // single file upload with field name 'avatar'

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

      // Check if a user with the given email already exists
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
          avatarBase64 = `data:${
            req.file.mimetype
          };base64,${compressedImageBuffer.toString("base64")}`;
        } catch (imageError) {
          console.error("Error compressing image:", imageError);
          return next(errorHandler(500, "Image processing error"));
        }
      } else {
        // Use default avatar URL if no file is uploaded
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
      avatar: tempUser.avatar, // Now storing Base64 string
      first_name: tempUser.first_name,
      last_name: tempUser.last_name,
      email: tempUser.email,
      password: tempUser.hashedPassword,
    });

    await newUser.save();

    clearTempUser(req);

    return res.status(200).json({ message: "User Registration Success" });
  } catch (error) {
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
        <h2>Welcome to G.S.P Traders Pvt Ltd</h2>
        <p>Your new OTP is:</p>
        <h1 style="font-size: 2em; font-weight: bold;">${otp}</h1>
      </div>
    `;
    await sendMail(email, "Your New OTP for G.S.P Traders Pvt Ltd", message);

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
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
    const normalizedEmail = email.toLowerCase();

    const validUser = await User.findOne({ email: normalizedEmail });
    if (!validUser) {
      return next(errorHandler(404, "Invalid Credentials"));
    }

    const validPassword = await compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(405, "Invalid Credentials"));
    }

    validUser.status = "active";
    validUser.lastLogin = new Date();
    await validUser.save();

    const token = sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: pass, ...rest } = validUser._doc;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json(rest);
  } catch (error) {
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

      const token = sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;

      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = hashSync(generatedPassword, 10);

      const avatarUrl =
        googlePhotoUrl && googlePhotoUrl.startsWith("https")
          ? await convertImageToBase64(googlePhotoUrl)
          : null;

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
      const token = sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;

      return res
        .status(201)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

const requestOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const normalizedEmail = email.toLowerCase();

    // Check if the user exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (!existingUser) {
      return next(errorHandler(404, "User not found"));
    }
    // Generate and hash OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedOtp = hashSync(otp.toString(), 10);

    // Temporarily store OTP and email
    const tempUserData = {
      email,
      hashedOtp,
      otpExpiresAt: Date.now() + 2.3 * 60 * 1000, // OTP expires in 3 minutes
    };
    storeTempUser(req, tempUserData);

    // Send OTP via email
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

    // Proceed to password reset page
    return res
      .status(200)
      .json({ message: "OTP verified. Proceed to reset password." });
  } catch (error) {
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

    // Generate a new 6-digit OTP and hash it
    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedOtp = hashSync(otp.toString(), 10);

    // Update the session with the new OTP and expiry time
    tempUser.hashedOtp = hashedOtp;
    tempUser.otpExpiresAt = Date.now() + 2.3 * 60 * 1000; // OTP expires in 2.5 minutes
    storeTempUser(req, tempUser);

    console.log("New OTP generated:", otp);

    // Send an email to the user with the new OTP
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

    // Hash the new password
    const hashedPassword = hashSync(password, 10);

    // Update the user's password
    await User.updateOne(
      { email: tempUser.email },
      { password: hashedPassword }
    );

    // Clear temporary data
    clearTempUser(req);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

const add_employee = async (req, res, next) => {
  try {
    const { first_name, last_name, email, mobile, role } = req.body;

    const normalizedEmail = email.toLowerCase(); // Normalize email

    // Check if user already exists
    let existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return next(errorHandler(400, "User Email Already Exists"));
    }

    let existingUserByMobile = await User.findOne({ mobile });
    if (existingUserByMobile) {
      return next(errorHandler(401, "Mobile Number Already Exists"));
    }

    // Generate a random password
    const generatedPassword = `${first_name}@1234`;

    // Hash the password before saving
    const hashedPassword = await hash(generatedPassword, 10);

    // Create new user
    const newUser = new User({
      first_name,
      last_name,
      email: normalizedEmail,
      mobile,
      role,
      password: hashedPassword, // Store hashed password
    });

    // Save the user to the database
    await newUser.save();

    // Send email with the non-hashed password and role
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
    next(error);
  }
};

const login_employee = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const normalizedEmail = email.toLowerCase(); // Normalize email

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

    // Check if user exists
    let user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return next(errorHandler(400, "Invalid email or password."));
    }

    // Check if password matches
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return next(errorHandler(400, "Invalid email or password."));
    }

    // Check if role matches
    if (user.role !== role) {
      return next(errorHandler(400, "Invalid role selection."));
    }

    user.status = "active";
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token (including email and role)
    const token = sign(
      {
        id: user._id,
        email: user.email, // Include email
        role: user.role, // Include role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: pass, ...rest } = user._doc;

    let statusCode = emailStatusMap[normalizedEmail] || 200; // Default to 200 if email not found in map

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(statusCode).json(rest);
  } catch (error) {
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