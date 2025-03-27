import Worker from "../models/Worker.js";
import Appointment from "../models/Appointment.js";
import multer, { memoryStorage } from "multer";
import sharp from "sharp";
import { hashSync, compareSync } from "bcrypt";
import sendMail from "../middleware/sendMail.js";
import jwt from "jsonwebtoken";

const storage = memoryStorage();
const upload = multer({ storage }).single("profilePicture");

// Create a new worker
const createWorker = async (req, res) => {
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
        nic, // Added NIC
        primarySpecialization,
        skills,
        certifications,
        hireDate,
        weeklyAvailability,
        additionalNotes,
        workload,
        status,
      } = req.body;

      if (
        !fullName ||
        !email ||
        !phoneNumber ||
        !address ||
        !nic || // Added NIC to required fields
        !primarySpecialization ||
        !hireDate
      ) {
        return res.status(400).json({
          success: false,
          message: "All required fields must be provided",
        });
      }

      const normalizedEmail = email.toLowerCase();
      const existingWorkerByEmail = await Worker.findOne({ email: normalizedEmail });
      if (existingWorkerByEmail) {
        return res.status(400).json({
          success: false,
          message: "Worker email already exists",
        });
      }

      const existingWorkerByNic = await Worker.findOne({ nic }); // Check for duplicate NIC
      if (existingWorkerByNic) {
        return res.status(400).json({
          success: false,
          message: "Worker NIC already exists",
        });
      }

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
            parsedSkills = skills.split(",").map((item) => item.trim());
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
            parsedCertifications = certifications
              .split(",")
              .map((item) => item.trim());
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
          if (
            weeklyAvailability.startsWith("[") &&
            weeklyAvailability.endsWith("]")
          ) {
            parsedWeeklyAvailability = JSON.parse(weeklyAvailability);
          } else {
            parsedWeeklyAvailability = weeklyAvailability
              .split(",")
              .map((item) => item.trim());
          }
        }
      } catch (error) {
        console.error("Error parsing weeklyAvailability:", error);
        parsedWeeklyAvailability = [];
      }

      const defaultAvatarURL =
        "https://tse2.mm.bing.net/th?id=OIP.eCrcK2BiqwBGE1naWwK3UwHaHa&pid=Api&P=0&h=180";
      let profilePictureBase64;

      if (req.file) {
        try {
          const compressedImageBuffer = await sharp(req.file.buffer)
            .resize(300, 300)
            .jpeg({ quality: 80 })
            .toBuffer();
          profilePictureBase64 = `data:${req.file.mimetype};base64,${compressedImageBuffer.toString(
            "base64"
          )}`;
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

      const firstName = fullName.split(" ")[0];
      const generatedPassword = `${firstName}@1234`;
      const hashedPassword = hashSync(generatedPassword, 10);

      const newWorker = new Worker({
        fullName,
        email: normalizedEmail,
        password: hashedPassword,
        phoneNumber,
        address,
        nic, // Added NIC
        primarySpecialization,
        skills: parsedSkills,
        certifications: parsedCertifications,
        hireDate: new Date(hireDate),
        weeklyAvailability: parsedWeeklyAvailability,
        additionalNotes: additionalNotes || "",
        workload: workload || 0,
        status: status || "available",
        profilePicture: profilePictureBase64,
      });

      const savedWorker = await newWorker.save();

      const subject = "Your Worker Account Details";
      const htmlContent = `
        <p>Hello ${fullName},</p>
        <p>Your worker account has been created. Below are your login details:</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Password:</b> ${generatedPassword}</p>
        <p>Please change your password after logging in for the first time. Do not share your login credentials with anyone.</p>
        <p>Best regards,</p>
        <p>The Admin Team</p>
      `;

      await sendMail(normalizedEmail, subject, htmlContent);

      res.status(201).json({
        success: true,
        message: "Worker created successfully, email sent with login credentials.",
        data: savedWorker,
      });
    } catch (error) {
      console.error("Create Worker Error:", error);
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
        nic, // Added NIC
        primarySpecialization,
        skills,
        certifications,
        hireDate,
        weeklyAvailability,
        additionalNotes,
        workload,
        status,
      } = req.body;

      if (
        !fullName ||
        !email ||
        !phoneNumber ||
        !address ||
        !nic || // Added NIC to required fields
        !primarySpecialization ||
        !hireDate
      ) {
        return res.status(400).json({
          success: false,
          message: "All required fields must be provided",
        });
      }

      if (email) {
        const existingWorker = await Worker.findOne({
          email,
          _id: { $ne: workerId },
        });
        if (existingWorker) {
          return res.status(400).json({
            success: false,
            message: "Email is already in use by another worker",
          });
        }
      }

      if (nic) {
        const existingWorkerByNic = await Worker.findOne({
          nic,
          _id: { $ne: workerId },
        });
        if (existingWorkerByNic) {
          return res.status(400).json({
            success: false,
            message: "NIC is already in use by another worker",
          });
        }
      }

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
            parsedSkills = skills.split(",").map((item) => item.trim());
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
            parsedCertifications = certifications
              .split(",")
              .map((item) => item.trim());
          }
        }
      } catch (error) {
        console.error("Error parsing certifications:", error);
        parsedCertifications = [];
      }

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
          parsedWeeklyAvailability = weeklyAvailability.map(
            (day) => dayMapping[day.trim().toLowerCase()] || day
          );
        } else if (typeof weeklyAvailability === "string") {
          if (
            weeklyAvailability.startsWith("[") &&
            weeklyAvailability.endsWith("]")
          ) {
            parsedWeeklyAvailability = JSON.parse(weeklyAvailability).map(
              (day) => dayMapping[day.trim().toLowerCase()] || day
            );
          } else {
            parsedWeeklyAvailability = weeklyAvailability
              .split(",")
              .map((item) => dayMapping[item.trim().toLowerCase()] || item.trim());
          }
        }
      } catch (error) {
        console.error("Error parsing weeklyAvailability:", error);
        parsedWeeklyAvailability = [];
      }

      let profilePictureBase64;
      if (req.file) {
        try {
          const compressedImageBuffer = await sharp(req.file.buffer)
            .resize(300, 300)
            .jpeg({ quality: 80 })
            .toBuffer();
          profilePictureBase64 = `data:${req.file.mimetype};base64,${compressedImageBuffer.toString(
            "base64"
          )}`;
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
          nic, // Added NIC
          primarySpecialization,
          skills: parsedSkills,
          certifications: parsedCertifications,
          hireDate: hireDate ? new Date(hireDate) : undefined,
          weeklyAvailability: parsedWeeklyAvailability,
          additionalNotes,
          workload,
          status,
          ...(profilePictureBase64 && { profilePicture: profilePictureBase64 }),
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

// Worker Login
const loginWorker = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const worker = await Worker.findOne({ email: normalizedEmail }).populate({
      path: "tasks",
      select: "make model year carNumberPlate mileage serviceType appointmentDate appointmentTime notes user status",
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = compareSync(password, worker.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    worker.lastLogin = new Date();
    await worker.save();

    const token = jwt.sign(
      { id: worker._id, email: worker.email, role: "worker" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: pass, ...workerData } = worker._doc;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      message: "Worker logged in successfully",
      data: workerData,
    });
  } catch (error) {
    console.error("Worker Login Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get current schedule
const getCurrentSchedule = async (req, res) => {
  try {
    const workerId = req.user?.id;

    if (!workerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No worker ID found",
      });
    }

    const worker = await Worker.findById(workerId).populate({
      path: "tasks",
      select: "make model year carNumberPlate mileage serviceType appointmentDate appointmentTime notes user status",
      match: {
        appointmentDate: { $gte: new Date() },
        status: { $ne: "Cancelled" },
      },
      options: { sort: { appointmentDate: 1, appointmentTime: 1 } },
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    const schedule = worker.tasks.map((task) => ({
      id: task._id,
      make: task.make,
      model: task.model,
      year: task.year,
      carNumberPlate: task.carNumberPlate,
      mileage: task.mileage,
      serviceType: task.serviceType,
      appointmentDate: task.appointmentDate,
      appointmentTime: task.appointmentTime,
      notes: task.notes || "",
      user: task.user,
      status: task.status,
      fullDateTime: task.appointmentDateTime,
    }));

    res.status(200).json({
      success: true,
      message: "Schedule retrieved successfully",
      data: {
        worker: {
          fullName: worker.fullName,
          email: worker.email,
          primarySpecialization: worker.primarySpecialization,
        },
        schedule,
      },
    });
  } catch (error) {
    console.error("Get Schedule Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Sign out worker
const signoutWorker = async (req, res) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      message: "Worker logged out successfully",
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
  loginWorker,
  getCurrentSchedule,
  signoutWorker,
};