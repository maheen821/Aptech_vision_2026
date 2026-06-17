import express from "express";
import Doctor from "../models/Doctor.js";
import Symptom from "../models/Symptom.js";

const router = express.Router();

/* ─────────────────────────────
   ANALYZE SYMPTOMS
───────────────────────────── */
router.post("/", async (req, res) => {
  try {

    const { symptoms = [], description = "" } = req.body;

    const specialties = new Set();

    // Symptoms → Category
    if (symptoms.length > 0) {

      const dbSymptoms = await Symptom.find({
        name: { $in: symptoms }
      });

      dbSymptoms.forEach((sym) => {

        const category = sym.category?.toLowerCase() || "";

        if (category.includes("heart")) {
          specialties.add("Cardiology");
        }

        if (category.includes("skin")) {
          specialties.add("Dermatology");
        }

        if (category.includes("brain")) {
          specialties.add("Neurology");
        }

        if (category.includes("lung")) {
          specialties.add("Pulmonology");
        }

        if (category.includes("ent")) {
          specialties.add("ENT");
        }

        if (category.includes("bone")) {
          specialties.add("Orthopedics");
        }

        if (category.includes("child")) {
          specialties.add("Pediatrics");
        }

        if (category.includes("general")) {
          specialties.add("General Medicine");
        }

      });

    }

    // Description Analysis
    const text = description.toLowerCase();

    if (text.includes("chest")) {
      specialties.add("Cardiology");
    }

    if (text.includes("skin") || text.includes("rash")) {
      specialties.add("Dermatology");
    }

    if (text.includes("headache")) {
      specialties.add("Neurology");
    }

    // fallback
    if (specialties.size === 0) {
      specialties.add("General Medicine");
    }

    const specialtyArray = [...specialties];

    // Fetch Doctors
    const doctors = await Doctor.find({
      specialty: { $in: specialtyArray }
    }).sort({ rating: -1 });

    res.json({
      matchedSpecialties: specialtyArray,
      doctors
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message
    });

  }
});
router.post("/", async (req, res) => {
  try {
    const { symptoms = [], description = "" } = req.body;

    const text = [...symptoms, description].join(" ").toLowerCase();

    const categories = await Category.find();

    let matchedCategory = null;

    for (const cat of categories) {
      if (cat.keywords.some(k => text.includes(k.toLowerCase()))) {
        matchedCategory = cat;
        break;
      }
    }

    if (!matchedCategory) {
      matchedCategory = await Category.findOne({ name: "General" });
    }

    const specialties = await Specialty.find({
      category: matchedCategory.name,
    });

    const specialtyNames = specialties.length
      ? specialties.map(s => s.name)
      : ["General Medicine"];

    const doctors = await Doctor.find({
      specialty: { $in: specialtyNames }
    }).sort({ rating: -1 });

    res.json({
      matchedCategory: matchedCategory.name,
      color: matchedCategory.color,
      icon: matchedCategory.icon,
      matchedSpecialties: specialtyNames,
      doctors
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
/* ─────────────────────────────
   GET ALL ANALYSIS HISTORY
───────────────────────────── */
router.get("/", async (req, res) => {
  res.json({
    message: "Analyze API Working"
  });
});

/* ─────────────────────────────
   UPDATE
───────────────────────────── */
router.put("/:id", async (req, res) => {
  try {

    res.json({
      message: "Update API Working",
      id: req.params.id
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
});

/* ─────────────────────────────
   DELETE
───────────────────────────── */
router.delete("/:id", async (req, res) => {
  try {

    res.json({
      message: "Delete API Working",
      id: req.params.id
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
});

export default router; 