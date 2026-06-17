import express from "express";
import Category from "../models/Category.js";
import { generateColor } from "../utils/generateColor.js";
import { generateIcon } from "../utils/generateIcon.js";
// 🔔 1. Notification helper ko yahan import karein
import { createAdminNotification } from "../utils/notificationHelper.js";

const router = express.Router();

/* ─── GET ALL ─── */
router.get("/", async (req, res) => {
  try {
    const data = await Category.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ─── CREATE ─── */
router.post("/", async (req, res) => {
  try {
    const { name, keywords = [] } = req.body;

    const category = await Category.create({
      name,
      keywords,
      color: generateColor(name),
      icon: generateIcon(name),
    });

    // 🔔 2. Nayi category banne par notification trigger karein
    try {
      await createAdminNotification(`New Category has been added: ${name}`, "add");
    } catch (notifErr) {
      console.error("⚠️ Notification helper fail hua:", notifErr.message);
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ─── UPDATE (EDIT CATEGORY) ─── */
router.put("/:id", async (req, res) => {
  try {
    const { name, keywords = [] } = req.body;

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        keywords,
        color: generateColor(name),   // auto update color
        icon: generateIcon(name),     // auto update icon
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    // 🔔 3. Edit hone par notification trigger karein
    try {
      await createAdminNotification(`Category has been updated: '${name}'`, "update");
    } catch (notifErr) {
      console.error("⚠️ Notification helper fail hua:", notifErr.message);
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ─── DELETE ─── */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    // 🔔 4. Delete hone par notification trigger karein
    // Kyunki category delete ho chuki hai, hum 'deleted.name' se uska naam nikalenge
    try {
      await createAdminNotification(`Category has been deleted: ${deleted.name}`, "delete");
    } catch (notifErr) {
      console.error("⚠️ Notification helper fail hua:", notifErr.message);
    }

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;