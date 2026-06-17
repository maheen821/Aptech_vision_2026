import express from "express";
import Specialty from "../models/Specialty.js";
// 🔔 1. Notification helper ko yahan import kiya
import { createAdminNotification } from "../utils/notificationHelper.js";

const router = express.Router();

// GET all specialties
router.get("/", async (req, res) => {
  try {
    const data = await Specialty.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create specialty
router.post("/", async (req, res) => {
  try {
    const specialty = await Specialty.create(req.body);

    // 🔔 2. Nayi specialty banne par notification trigger
    try {
      await createAdminNotification(`New Specialty has been added!: ${req.body.name}`, "add");
    } catch (notifErr) {
      console.error("⚠️ Notification helper fail hua:", notifErr.message);
    }

    res.json(specialty);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// PUT (EDIT / UPDATE specialty)
router.put("/:id", async (req, res) => {
  try {
    const updatedSpecialty = await Specialty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // updated data return karega
    );

    if (!updatedSpecialty) {
      return res.status(404).json({ message: "Specialty not found" });
    }

    // 🔔 3. Edit hone par notification trigger
    try {
      await createAdminNotification(` New Specialty '${req.body.name || updatedSpecialty.name}' has been updated`, "update");
    } catch (notifErr) {
      console.error("⚠️ Notification helper fail hua:", notifErr.message);
    }

    res.json(updatedSpecialty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE specialty
router.delete("/:id", async (req, res) => {
  try {
    // Pehle find aur delete dono ek sath karenge taaki database se purana naam mil sake
    const deletedSpecialty = await Specialty.findByIdAndDelete(req.params.id);

    if (!deletedSpecialty) {
      return res.status(404).json({ message: "Specialty not found" });
    }

    // 🔔 4. Delete hone par notification trigger
    try {
      await createAdminNotification(`New Specialty has been deleted: ${deletedSpecialty.name}`, "delete");
    } catch (notifErr) {
      console.error("⚠️ Notification helper fail hua:", notifErr.message);
    }

    res.json({ message: "Specialty deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;