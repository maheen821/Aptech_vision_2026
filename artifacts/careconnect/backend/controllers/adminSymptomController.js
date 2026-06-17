import Symptom from "../models/Symptom.js";

/* GET ALL */
export const getSymptoms = async (req, res) => {
  try {
    const data = await Symptom.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* CREATE */
export const createSymptom = async (req, res) => {
  try {
    const { name, category, specialties } = req.body;

    const exists = await Symptom.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Symptom already exists" });
    }

    const symptom = await Symptom.create({
      name,
      category,
      specialties
    });

    res.json(symptom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE */
export const updateSymptom = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Symptom.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE */
export const deleteSymptom = async (req, res) => {
  try {
    const { id } = req.params;

    await Symptom.findByIdAndDelete(id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};