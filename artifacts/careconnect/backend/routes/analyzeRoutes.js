import express from "express";
import Doctor from "../models/Doctor.js";
import Symptom from "../models/Symptom.js";
import Category from "../models/Category.js"; 

const router = express.Router();

/* ──────────────────────────────────────────────────────────
   ANALYZE SYMPTOMS & TEXT DESCRIPTION
────────────────────────────────────────────────────────── */
router.post("/", async (req, res) => {
  try {
    const { symptoms = [], description = "" } = req.body;

    const specialties = new Set();
    const combinedText = [...symptoms, description].join(" ").toLowerCase();

    /* ========================================================
       1. CATEGORY MATCHING (Database Symptoms Extraction Loop)
       ======================================================== */
    if (symptoms.length > 0) {
      const dbSymptoms = await Symptom.find({
        name: { $in: symptoms.map(s => new RegExp(`^${s.trim()}$`, "i")) }
      });
      
      dbSymptoms.forEach((sym) => {
        const category = sym.category?.toLowerCase().trim() || "";

        // Cardiology
        if (
          category.includes("cardio") ||
          category.includes("cardiology") ||
          category.includes("hypertension") ||
          category.includes("vascular") ||
          category.includes("ischemic")
        ) specialties.add("Cardiology");

        // Dermatology
        if (
          category.includes("skin") ||
          category.includes("derm") ||
          category.includes("dermatology") ||
          category.includes("eczema") ||
          category.includes("psoriasis")
        ) specialties.add("Dermatology");

        // Neurology
        if (
          category.includes("brain") ||
          category.includes("neuro") ||
          category.includes("neurology") ||
          category.includes("seizure") ||
          category.includes("epilepsy") ||
          category.includes("stroke")
        ) specialties.add("Neurology");

        // Pulmonology
        if (
          category.includes("lung") ||
          category.includes("pulmo") ||
          category.includes("pulmonology") ||
          category.includes("asthma") ||
          category.includes("copd") ||
          category.includes("respiratory")
        ) specialties.add("Pulmonology");

        // ENT
        if (
          category.includes("ent") ||
          category.includes("sinusitis") ||
          category.includes("otolaryngology")
        ) specialties.add("ENT");

        // Orthopedics
        if (
          category.includes("bone") ||
          category.includes("ortho") ||
          category.includes("orthopedics") ||
          category.includes("fracture") ||
          category.includes("arthritis") ||
          category.includes("rheumatology") ||
          category.includes("spine")
        ) specialties.add("Orthopedics");

        // Pediatrics
        if (
          category.includes("child") ||
          category.includes("ped") ||
          category.includes("pediatrics") ||
          category.includes("baby") ||
          category.includes("neonatal") ||
          category.includes("vaccination")
        ) specialties.add("Pediatrics");

        // General Medicine
        if (
          category.includes("general") ||
          category.includes("medicine") ||
          category.includes("internal medicine") ||
          category.includes("physician")
        ) specialties.add("General Medicine");

        // Ophthalmology
        if (
          category.includes("eye") ||
          category.includes("opth") ||
          category.includes("ophthalmology") ||
          category.includes("cataract") ||
          category.includes("glaucoma")
        ) specialties.add("Ophthalmology");

        // Gastroenterology
        if (
          category.includes("stomach") ||
          category.includes("gastro") ||
          category.includes("gastroenterology") ||
          category.includes("hepatology") ||
          category.includes("ibs")
        ) specialties.add("Gastroenterology");

        // Endocrinology
        if (
          category.includes("diabetes") ||
          category.includes("thyroid") ||
          category.includes("obesity") ||
          category.includes("hormone") ||
          category.includes("endocrinology")
        ) specialties.add("Endocrinology");

        // Psychiatry
        if (
          category.includes("mental") ||
          category.includes("psych") ||
          category.includes("psychiatry") ||
          category.includes("psychology")
        ) specialties.add("Psychiatry");

        // Dentistry
        if (
          category.includes("dental") ||
          category.includes("dentist") ||
          category.includes("dentistry") ||
          category.includes("orthodontics")
        ) specialties.add("Dentistry");

        // Urology
        if (
          category.includes("urology") ||
          category.includes("nephrology") ||
          category.includes("prostate")
        ) specialties.add("Urology");

        // Gynecology
        if (
          category.includes("gyne") ||
          category.includes("gynecology") ||
          category.includes("obstetrics") ||
          category.includes("pcos") ||
          category.includes("pregnancy") ||
          category.includes("infertility")
        ) specialties.add("Gynecology");
      });
    }

    /* ========================================================
       2. TEXT DESCRIPTION & COMPLAINTS PARSING (Isolated Filter)
       ======================================================== */
    
    // Cardiology
    if (
      combinedText.includes("chest pain") ||
      combinedText.includes("blood pressure") ||
      combinedText.includes("palpitations") ||
      combinedText.includes("heart failure") ||
      combinedText.includes("cholesterol") ||
      combinedText.includes("heartbeat") ||
      combinedText.includes("angina") ||
      combinedText.includes("shortness of breath on walking") ||
      combinedText.includes("uneasiness in chest") ||
      combinedText.includes("heart attack")
    ) specialties.add("Cardiology");

    // Dermatology
    if (
      combinedText.includes("allergy") ||
      combinedText.includes("acne") ||
      combinedText.includes("itching") ||
      combinedText.includes("hair loss") ||
      combinedText.includes("hairfall") ||
      combinedText.includes("rash") ||
      combinedText.includes("pimples") ||
      combinedText.includes("dandruff") ||
      combinedText.includes("dark spots") ||
      combinedText.includes("skin fungal") ||
      combinedText.includes("ringworm") ||
      combinedText.includes("blisters") ||
      combinedText.includes("warts")
    ) specialties.add("Dermatology");

    // Neurology
    if (
      combinedText.includes("headache") ||
      combinedText.includes("migraine") ||
      combinedText.includes("memory loss") ||
      combinedText.includes("dizziness") ||
      combinedText.includes("vertigo") ||
      combinedText.includes("fits") ||
      combinedText.includes("paralysis") ||
      combinedText.includes("numbness") ||
      combinedText.includes("tingling") ||
      combinedText.includes("fainting") ||
      combinedText.includes("sciatica")
    ) specialties.add("Neurology");

    // Pulmonology
    if (
      combinedText.includes("cough") ||
      combinedText.includes("breathing") ||
      combinedText.includes("shortness of breath") ||
      combinedText.includes("wheezing") ||
      combinedText.includes("phlegm") ||
      combinedText.includes("sputum") ||
      combinedText.includes("chest congestion") ||
      combinedText.includes("snoring") ||
      combinedText.includes("sleep apnea")
    ) specialties.add("Pulmonology");

    // ENT
    if (
      combinedText.includes("ear") ||
      combinedText.includes("hearing") ||
      combinedText.includes("throat") ||
      combinedText.includes("nose") ||
      combinedText.includes("tonsil") ||
      combinedText.includes("ear discharge") ||
      combinedText.includes("ear pain") ||
      combinedText.includes("tinnitus") ||
      combinedText.includes("sore throat") ||
      combinedText.includes("nose bleeding") ||
      combinedText.includes("blocked nose")
    ) specialties.add("ENT");

    // Orthopedics
    if (
      combinedText.includes("joint") ||
      combinedText.includes("back pain") ||
      combinedText.includes("neck pain") ||
      combinedText.includes("shoulder pain") ||
      combinedText.includes("knee pain") ||
      combinedText.includes("muscle cramp") ||
      combinedText.includes("ligament injury") ||
      combinedText.includes("swollen joints") ||
      combinedText.includes("bone pain") ||
      combinedText.includes("heel pain") ||
      combinedText.includes("uric acid pain")
    ) specialties.add("Orthopedics");

    // Pediatrics
    if (
      combinedText.includes("kid") ||
      combinedText.includes("infant") ||
      combinedText.includes("pediatric clinic") ||
      combinedText.includes("child bedwetting") ||
      combinedText.includes("child growth") ||
      combinedText.includes("teething issue")
    ) specialties.add("Pediatrics");

    // Ophthalmology
    if (
      combinedText.includes("vision") ||
      combinedText.includes("blurred vision") ||
      combinedText.includes("red eyes") ||
      combinedText.includes("dry eyes") ||
      combinedText.includes("eye itching") ||
      combinedText.includes("watery eyes") ||
      combinedText.includes("dark circles") ||
      combinedText.includes("double vision") ||
      combinedText.includes("burning eye")
    ) specialties.add("Ophthalmology");

    // Gastroenterology
    if (
      combinedText.includes("acidity") ||
      combinedText.includes("diarrhea") ||
      combinedText.includes("constipation") ||
      combinedText.includes("vomiting") ||
      combinedText.includes("nausea") ||
      combinedText.includes("bloating") ||
      combinedText.includes("heartburn") ||
      combinedText.includes("gas problem") ||
      combinedText.includes("indigestion") ||
      combinedText.includes("loose motions") ||
      combinedText.includes("stomach ulcer") ||
      combinedText.includes("fatty liver") ||
      combinedText.includes("piles") ||
      combinedText.includes("bleeding in stool")
    ) specialties.add("Gastroenterology");

    // Endocrinology
    if (
      combinedText.includes("sugar level") ||
      combinedText.includes("weight gain") ||
      combinedText.includes("weight loss") ||
      combinedText.includes("metabolism") ||
      combinedText.includes("goiter") ||
      combinedText.includes("excessive thirst") ||
      combinedText.includes("hormonal imbalance")
    ) specialties.add("Endocrinology");

    // Psychiatry
    if (
      combinedText.includes("depression") ||
      combinedText.includes("anxiety") ||
      combinedText.includes("stress") ||
      combinedText.includes("insomnia") ||
      combinedText.includes("panic attack") ||
      combinedText.includes("mood swings") ||
      combinedText.includes("overthinking") ||
      combinedText.includes("bipolar") ||
      combinedText.includes("sleeplessness")
    ) specialties.add("Psychiatry");

    // Dentistry
    if (
      combinedText.includes("tooth") ||
      combinedText.includes("teeth") ||
      combinedText.includes("gum bleeding") ||
      combinedText.includes("cavity") ||
      combinedText.includes("toothache") ||
      combinedText.includes("wisdom tooth") ||
      combinedText.includes("bad breath") ||
      combinedText.includes("mouth ulcers") ||
      combinedText.includes("root canal")
    ) specialties.add("Dentistry");

    // Urology
    if (
      combinedText.includes("uti") ||
      combinedText.includes("urine") ||
      combinedText.includes("urinary tract") ||
      combinedText.includes("kidney stone") ||
      combinedText.includes("burning urination") ||
      combinedText.includes("frequent urination") ||
      combinedText.includes("blood in urine") ||
      combinedText.includes("prostate enlargement")
    ) specialties.add("Urology");

    // Gynecology
    if (
      combinedText.includes("menstrual") ||
      combinedText.includes("period") ||
      combinedText.includes("delivery") ||
      combinedText.includes("irregular periods") ||
      combinedText.includes("white discharge") ||
      combinedText.includes("leukorrhea") ||
      combinedText.includes("pregnancy test") ||
      combinedText.includes("labor pain")
    ) specialties.add("Gynecology");

    // General Physician (Medicine)
    if (
      combinedText.includes("fever") ||
      combinedText.includes("cold") ||
      combinedText.includes("flu") ||
      combinedText.includes("fatigue") ||
      combinedText.includes("weakness") ||
      combinedText.includes("body aches") ||
      combinedText.includes("typhoid") ||
      combinedText.includes("malaria") ||
      combinedText.includes("dengue") ||
      combinedText.includes("low energy") ||
      combinedText.includes("infection") ||
      combinedText.includes("shivering")
    ) specialties.add("General Medicine");


    /* ========================================================
       3. DYNAMIC CATEGORY MATCHING BACKUP
       ======================================================== */
    if (specialties.size === 0) {
      const categories = await Category.find();
      for (const cat of categories) {
        if (cat.keywords && cat.keywords.some(k => combinedText.includes(k.toLowerCase()))) {
          const name = cat.name?.toLowerCase() || "";
          if (name.includes("heart") || name.includes("cardio")) specialties.add("Cardiology");
          else if (name.includes("skin") || name.includes("derm")) specialties.add("Dermatology");
          else if (name.includes("brain") || name.includes("neuro")) specialties.add("Neurology");
          else if (name.includes("lung") || name.includes("pulmo")) specialties.add("Pulmonology");
          else if (name.includes("bone") || name.includes("ortho")) specialties.add("Orthopedics");
          else if (name.includes("child") || name.includes("ped")) specialties.add("Pediatrics");
          else if (name.includes("ent")) specialties.add("ENT");
          else if (name.includes("stomach") || name.includes("gastro")) specialties.add("Gastroenterology");
          else if (name.includes("dental")) specialties.add("Dentistry");
          break;
        }
      }
    }

    // Default fallback if no match found anywhere
    if (specialties.size === 0) {
      specialties.add("General Medicine");
    }

    const specialtyArray = [...specialties];

    /* ========================================================
       4. DOCTORS FETCH VIA CASE-INSENSITIVE REGEX
       ======================================================== */
    const specialtyRegexArray = specialtyArray.map(spec => new RegExp(`^${spec.trim()}$`, "i"));

    const doctors = await Doctor.find({
      specialty: { $in: specialtyRegexArray }
    }).sort({ rating: -1 });

    // Response send karein
    res.json({
      matchedSpecialties: specialtyArray,
      doctors
    });

  } catch (err) {
    console.error("Analysis Server Error: ", err);
    res.status(500).json({
      message: err.message || "Internal Server Error during analysis workflow"
    });
  }
});

/* ──────────────────────────────────────────────────────────
   GET ALL ANALYSIS HISTORY
────────────────────────────────────────────────────────── */
router.get("/", async (req, res) => {
  try {
    res.json({ message: "Analyze API Working smoothly" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ──────────────────────────────────────────────────────────
   UPDATE
────────────────────────────────────────────────────────── */
router.put("/:id", async (req, res) => {
  try {
    res.json({ message: "Update API Working", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ──────────────────────────────────────────────────────────
   DELETE
────────────────────────────────────────────────────────── */
router.delete("/:id", async (req, res) => {
  try {
    res.json({ message: "Delete API Working", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;