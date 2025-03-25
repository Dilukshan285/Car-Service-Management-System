import Worker from "../models/Worker.js";
import Appointment from "../models/Appointment.js";
import multer, { memoryStorage } from "multer";
import sharp from "sharp";

// Configure multer storage to store files in memory
const storage = memoryStorage();
const upload = multer({ storage }).single("profilePicture"); // single file upload with field name 'profilePicture'

// Create a new worker
const createWorker = async (req, res) => {
  // Handle file upload first
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "File upload error",
      });
    }

    try {
      const {
        fullName,
        email,
        phoneNumber,
        address,
        primarySpecialization,
        skills,
        certifications,
        hireDate,
        weeklyAvailability,
        hourlyRate,
        additionalNotes,
        workload,
        status,
      } = req.body;

      // Validate required fields
      if (
        !fullName ||
        !email ||
        !phoneNumber ||
        !address ||
        !primarySpecialization ||
        !hireDate ||
        !hourlyRate
      ) {
        return res.status(400).json({
          success: false,
          message: "All required fields must be provided",
        });
      }

      // Parse skills, certifications, and weeklyAvailability to ensure they are arrays
      let parsedSkills = [];
      let parsedCertifications = [];
      let parsedWeeklyAvailability = [];

      try {
        if (Array.isArray(skills)) {
          parsedSkills = skills;
        } else if (typeof skills === "string") {
          if (skills.startsWith("[") && skills.endsWith("]")) {
            parsedSkills = JSON.parse(skills);
          } else {
            parsedSkills = skills.split(",").map(item => item.trim());
          }
        }
      } catch (error) {
        console.error("Error parsing skills:", error);
        parsedSkills = [];
      }

      try {
        if (Array.isArray(certifications)) {
          parsedCertifications = certifications;
        } else if (typeof certifications === "string") {
          if (certifications.startsWith("[") && certifications.endsWith("]")) {
            parsedCertifications = JSON.parse(certifications);
          } else {
            parsedCertifications = certifications.split(",").map(item => item.trim());
          }
        }
      } catch (error) {
        console.error("Error parsing certifications:", error);
        parsedCertifications = [];
      }

      try {
        if (Array.isArray(weeklyAvailability)) {
          parsedWeeklyAvailability = weeklyAvailability;
        } else if (typeof weeklyAvailability === "string") {
          if (weeklyAvailability.startsWith("[") && weeklyAvailability.endsWith("]")) {
            parsedWeeklyAvailability = JSON.parse(weeklyAvailability);
          } else {
            parsedWeeklyAvailability = weeklyAvailability.split(",").map(item => item.trim());
          }
        }
      } catch (error) {
        console.error("Error parsing weeklyAvailability:", error);
        parsedWeeklyAvailability = [];
      }

      // Handle profile picture
      const defaultAvatarURL =
        "https://tse2.mm.bing.net/th?id=OIP.eCrcK2BiqwBGE1naWwK3UwHaHa&pid=Api&P=0&h=180";
      let profilePictureBase64;

      if (req.file) {
        try {
          const compressedImageBuffer = await sharp(req.file.buffer)
            .resize(300, 300) // Resize to 300x300 pixels
            .jpeg({ quality: 80 }) // Compress to 80% quality
            .toBuffer();
          profilePictureBase64 = `data:${req.file.mimetype};base64,${compressedImageBuffer.toString("base64")}`;
        } catch (imageError) {
          console.error("Error compressing image:", imageError);
          return res.status(500).json({
            success: false,
            message: "Image processing error",
          });
        }
      } else {
        profilePictureBase64 = defaultAvatarURL;
      }

      const newWorker = new Worker({
        fullName,
        email,
        phoneNumber,
        address,
        primarySpecialization,
        skills: parsedSkills,
        certifications: parsedCertifications,
        hireDate: new Date(hireDate),
        weeklyAvailability: parsedWeeklyAvailability, // Use parsed weeklyAvailability
        hourlyRate: parseFloat(hourlyRate),
        additionalNotes: additionalNotes || "",
        workload: workload || 0,
        status: status || "available",
        profilePicture: profilePictureBase64,
      });

      const savedWorker = await newWorker.save();

      res.status(201).json({
        success: true,
        message: "Worker created successfully",
        data: savedWorker,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
};

// Get all workers
const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find()
      .populate("tasks", "carType carNumberPlate serviceType appointmentDate")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: workers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a worker
const updateWorker = async (req, res) => {
  // Handle file upload first
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "File upload error",
      });
    }

    try {
      const { workerId } = req.params;
      const {
        fullName,
        email,
        phoneNumber,
        address,
        primarySpecialization,
        skills,
        certifications,
        hireDate,
        weeklyAvailability,
        hourlyRate,
        additionalNotes,
        workload,
        status,
      } = req.body;

      // Validate required fields
      if (
        !fullName ||
        !email ||
        !phoneNumber ||
        !address ||
        !primarySpecialization ||
        !hireDate ||
        !hourlyRate
      ) {
        return res.status(400).json({
          success: false,
          message: "All required fields must be provided",
        });
      }

      // Check if the email already exists for a different worker
      if (email) {
        const existingWorker = await Worker.findOne({ email, _id: { $ne: workerId } });
        if (existingWorker) {
          return res.status(400).json({
            success: false,
            message: "Email is already in use by another worker",
          });
        }
      }

      // Parse skills, certifications, and weeklyAvailability to ensure they are arrays
      let parsedSkills = [];
      let parsedCertifications = [];
      let parsedWeeklyAvailability = [];

      try {
        if (Array.isArray(skills)) {
          parsedSkills = skills;
        } else if (typeof skills === "string") {
          if (skills.startsWith("[") && skills.endsWith("]")) {
            parsedSkills = JSON.parse(skills);
          } else {
            parsedSkills = skills.split(",").map(item => item.trim());
          }
        }
      } catch (error) {
        console.error("Error parsing skills:", error);
        parsedSkills = [];
      }

      try {
        if (Array.isArray(certifications)) {
          parsedCertifications = certifications;
        } else if (typeof certifications === "string") {
          if (certifications.startsWith("[") && certifications.endsWith("]")) {
            parsedCertifications = JSON.parse(certifications);
          } else {
            parsedCertifications = certifications.split(",").map(item => item.trim());
          }
        }
      } catch (error) {
        console.error("Error parsing certifications:", error);
        parsedCertifications = [];
      }

      // Day mapping for weeklyAvailability
      const dayMapping = {
        Monday: "Mon",
        Tuesday: "Tue",
        Wednesday: "Wed",
        Thursday: "Thu",
        Friday: "Fri",
        Saturday: "Sat",
        Sunday: "Sun",
        monday: "Mon",
        tuesday: "Tue",
        wednesday: "Wed",
        thursday: "Thu",
        friday: "Fri",
        saturday: "Sat",
        sunday: "Sun",
      };

      try {
        if (Array.isArray(weeklyAvailability)) {
          parsedWeeklyAvailability = weeklyAvailability.map(day => dayMapping[day.trim().toLowerCase()] || day);
        } else if (typeof weeklyAvailability === "string") {
          if (weeklyAvailability.startsWith("[") && weeklyAvailability.endsWith("]")) {
            parsedWeeklyAvailability = JSON.parse(weeklyAvailability).map(day => dayMapping[day.trim().toLowerCase()] || day);
          } else {
            parsedWeeklyAvailability = weeklyAvailability
              .split(",")
              .map(item => dayMapping[item.trim().toLowerCase()] || item.trim());
          }
        }
      } catch (error) {
        console.error("Error parsing weeklyAvailability:", error);
        parsedWeeklyAvailability = [];
      }

      // Handle profile picture
      let profilePictureBase64;
      if (req.file) {
        try {
          const compressedImageBuffer = await sharp(req.file.buffer)
            .resize(300, 300) // Resize to 300x300 pixels
            .jpeg({ quality: 80 }) // Compress to 80% quality
            .toBuffer();
          profilePictureBase64 = `data:${req.file.mimetype};base64,${compressedImageBuffer.toString("base64")}`;
        } catch (imageError) {
          console.error("Error compressing image:", imageError);
          return res.status(500).json({
            success: false,
            message: "Image processing error",
          });
        }
      }

      const updatedWorker = await Worker.findByIdAndUpdate(
        workerId,
        {
          fullName,
          email,
          phoneNumber,
          address,
          primarySpecialization,
          skills: parsedSkills,
          certifications: parsedCertifications,
          hireDate: hireDate ? new Date(hireDate) : undefined,
          weeklyAvailability: parsedWeeklyAvailability,
          hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
          additionalNotes,
          workload,
          status,
          ...(profilePictureBase64 && { profilePicture: profilePictureBase64 }), // Update profile picture only if a new file is uploaded
        },
        { new: true, runValidators: true }
      );

      if (!updatedWorker) {
        return res.status(404).json({
          success: false,
          message: "Worker not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Worker updated successfully",
        data: updatedWorker,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
};
// Delete a worker
const deleteWorker = async (req, res) => {
  try {
    const { workerId } = req.params;

    const deletedWorker = await Worker.findByIdAndDelete(workerId);

    if (!deletedWorker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    // Remove worker reference from appointments
    await Appointment.updateMany(
      { worker: workerId },
      { $set: { worker: null } }
    );

    res.status(200).json({
      success: true,
      message: "Worker deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createWorker,
  getWorkers,
  updateWorker,
  deleteWorker,
};