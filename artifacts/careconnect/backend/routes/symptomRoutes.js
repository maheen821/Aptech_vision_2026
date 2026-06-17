// routes/symptomRoutes.js
import express from "express";
import Symptom from "../models/Symptom.js";
// 🔔 1. Notification helper ko yahan import kiya
import { createAdminNotification } from "../utils/notificationHelper.js";

const router = express.Router();

/* ───────── GET ALL ───────── */
router.get("/", async (req, res) => {
  try {
    const symptoms = await Symptom.find().sort({ category: 1 });
    res.json(symptoms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────── ADD SYMPTOM ───────── */
router.post("/", async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: "Name and category required" });
    }

    const exists = await Symptom.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Symptom already exists" });
    }

    const symptom = await Symptom.create({
      name,
      category
    });

    // 🔔 2. Naya symptom shamil hone par notification trigger
    try {
      await createAdminNotification(`Symptoms has been added: ${name} (${category})`, "add");
    } catch (notifErr) {
      console.error("⚠️ Notification helper fail hua:", notifErr.message);
    }

    res.status(201).json(symptom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────── UPDATE SYMPTOM ───────── */
router.put("/:id", async (req, res) => {
  try {
    const { name, category } = req.body;

    const updated = await Symptom.findByIdAndUpdate(
      req.params.id,
      { name, category },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Symptom not found" });
    }

    // 🔔 3. Symptom update hone par notification trigger
    try {
      await createAdminNotification(`Symptom has been updated: '${name || updated.name}'`, "update");
    } catch (notifErr) {
      console.error("⚠️ Notification helper fail hua:", notifErr.message);
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────── DELETE SYMPTOM ───────── */
router.delete("/:id", async (req, res) => {
  try {
    // Database se data remove karte waqt complete doc fetch kar rahe hain taaki name read ho sake
    const deleted = await Symptom.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Symptom not found" });
    }

    // 🔔 4. Delete successfully hone par notification trigger
    try {
      await createAdminNotification(`Symptom has been deleted: ${deleted.name}`, "delete");
    } catch (notifErr) {
      console.error("⚠️ Notification helper fail hua:", notifErr.message);
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;