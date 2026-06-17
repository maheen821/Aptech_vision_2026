import express from "express";
import Doctor from "../models/Doctor.js";
import multer from "multer";
import path from "path";
// 🔔 1. Notification helper ko yahan import kiya
import { createAdminNotification } from "../utils/notificationHelper.js";

const router = express.Router();

// ─────────────────────────────
// 📁 MULTER CONFIG
// ─────────────────────────────
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// helper to parse JSON safely
const safeParse = (data, fallback) => {
  try {
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

// ─────────────────────────────
// ➕ ADD DOCTOR (FULL MODEL SUPPORT)
// ─────────────────────────────
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const doctor = await Doctor.create({
      name: req.body.name,
      specialty: req.body.specialty,
      category: req.body.category,
      rating: Number(req.body.rating) || 0,
      reviewCount: Number(req.body.reviewCount) || 0,
      experience: Number(req.body.experience) || 0,
      fee: Number(req.body.fee) || 0,

      location: req.body.location || "",
      bio: req.body.bio || "",

      available: req.body.available === "true",

      // ⭐ FULL MODEL FIELDS
      education: safeParse(req.body.education, []),
      timings: safeParse(req.body.timings, []),
      treatments: safeParse(req.body.treatments, []),

      reviews: safeParse(req.body.reviews, []),

      successRate: Number(req.body.successRate) || 95,
      patientsTreated: Number(req.body.patientsTreated) || 0,

      imageUrl: req.file
        ? `/uploads/${req.file.filename}`
        : "/images/doctor-fallback.jpg",
    });

    // 🔔 2. Naya doctor add hone par notification trigger
    try {
      await createAdminNotification(`New Doctor has been added: Dr. ${req.body.name}`, "add");
    } catch (notifErr) {
      console.error("⚠️ Notification helper fail hua:", notifErr.message);
    }

    res.status(201).json({
      message: "Doctor added successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────
// 📥 GET ALL DOCTORS
// ─────────────────────────────
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json({ data: doctors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────
// 📥 GET SINGLE DOCTOR
// ─────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────
// ✏️ UPDATE DOCTOR (FULL FIXED)
// ─────────────────────────────
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      specialty: req.body.specialty,
      category: req.body.category,
      rating: Number(req.body.rating) || 0,
      reviewCount: Number(req.body.reviewCount) || 0,
      experience: Number(req.body.experience) || 0,
      fee: Number(req.body.fee) || 0,

      location: req.body.location || "",
      bio: req.body.bio || "",

      available: req.body.available === "true",

      // ⭐ FULL MODEL SUPPORT
      education: req.body.education ? JSON.parse(req.body.education) : [],
      timings: req.body.timings ? JSON.parse(req.body.timings) : [],
      treatments: req.body.treatments ? JSON.parse(req.body.treatments) : [],
      reviews: req.body.reviews ? JSON.parse(req.body.reviews) : [],
      successRate: Number(req.body.successRate) || 95,
      patientsTreated: Number(req.body.patientsTreated) || 0,
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // 🔔 3. Doctor profile update hone par notification trigger
    try {
      await createAdminNotification(`Dr. ${req.body.name} profile has been updated`, "update");
    } catch (notifErr) {
      console.error("⚠️ Notification helper fail hua:", notifErr.message);
    }

    res.json({
      message: "Doctor updated successfully",
      updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────
// ❌ DELETE DOCTOR
// ─────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    // Pehle doctor ko dhoond kar delete karenge taaki naam notification mein use ho sake
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // 🔔 4. Doctor delete hone par notification trigger
    try {
      await createAdminNotification(`Doctor has been deleted: Dr. ${deletedDoctor.name}`, "delete");
    } catch (notifErr) {
      console.error("⚠️ Notification helper fail hua:", notifErr.message);
    }

    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;