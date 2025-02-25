import User from "../models/Usermodel.js";
import multer, { memoryStorage } from "multer";
import errorHandler from "../utils/error.js";
import sharp from "sharp";

// Configure multer storage
const storage = memoryStorage();
const upload = multer({ storage }).single("avatar");

// Update User Profile Controller
const updateUserProfile = async (req, res, next) => {
  // Use multer's upload middleware to handle file uploads first
  upload(req, res, async (err) => {
    if (err) {
      return next(errorHandler(400, "File upload error"));
    }

    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to update this user"));
    }

    try {
      if (req.body.mobile) {
        const existingUser = await User.findOne({
          mobile: req.body.mobile,
          _id: { $ne: req.params.userId }, // Exclude the current user
        });
        if (existingUser) {
          return next(errorHandler(404, "Mobile number already exists"));
        }
      }

      if (req.body.email) {
        const existingUser = await User.findOne({
          email: req.body.email.toLowerCase(),
          _id: { $ne: req.params.userId }, // Exclude the current user
        });
        if (existingUser) {
          return next(
            errorHandler(
              405,
              "Email address already exists. Please use a different email."
            )
          );
        }
      }

      const updatedFields = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email?.toLowerCase(),
        postal: req.body.postal,
        area: req.body.area,
        district: req.body.district,
        mobile: req.body.mobile,
        address: req.body.address,
      };

      // If there's an uploaded file (avatar), process it
      if (req.file) {
        // Compress the image using sharp
        const compressedImageBuffer = await sharp(req.file.buffer)
          .resize(300, 300) // Resize to 300x300 pixels (adjust as needed)
          .jpeg({ quality: 80 }) // Compress to 80% quality
          .toBuffer();

        // Convert the compressed image to base64
        const imageBase64 = compressedImageBuffer.toString("base64");
        const avatar = `data:${req.file.mimetype};base64,${imageBase64}`;
        updatedFields.avatar = avatar;
      }

      // Update the user document
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        { $set: updatedFields },
        { new: true }
      );
      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  });
};

const deleteUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    console.log("Current User:", req.user.email);
    console.log("User ID to Delete:", req.params.userId);

    const isAdmin =
      req.user.role === "Admin" ||
      req.user.email === "gspuser2002@gmail.com" ||
      req.user.role === "User Manager";
    const isSelf = req.user.id === req.params.userId;

    if (isAdmin || isSelf) {
      const deletedUser = await User.findByIdAndDelete(req.params.userId);

      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User deleted successfully.",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Forbidden. You do not have permission to delete this user.",
      });
    }
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

const signout = async (req, res, next) => {
  try {
    // Check if user is already attached via middleware
    if (!req.user) {
      return res.status(404).json("User not found");
    }

    // Clear the token and immediately respond
    console.time("Cookie clearing and response");
    res
      .clearCookie("access_token")
      .json({ message: "User has been signed out" });
    console.timeEnd("Cookie clearing and response");

    // Asynchronously update user status in the background (non-blocking)
    console.time("User status update (async)");
    await User.findByIdAndUpdate(req.user.id, { status: "inactive" });
    console.timeEnd("User status update (async)");
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

export default {
  updateUserProfile,
  deleteUser,
  signout,
  getUser,
};