import Symptom from "../models/Symptom.js"; // 👈 Yeh import lazmi add karein
import { createAdminNotification } from "../utils/notificationHelper.js";

export const addSymptom = async (req, res) => {
  try {
    const symptom = await Symptom.create(req.body);
    await createAdminNotification(`New system enter in system: ${symptom.name}`, "add");
    res.status(201).json(symptom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSymptom = async (req, res) => {
  try {
    const symptom = await Symptom.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await createAdminNotification(`Symptom '${symptom.name}' has been successfully updated`, "update");
    res.json(symptom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSymptom = async (req, res) => {
  try {
    const symptom = await Symptom.findByIdAndDelete(req.params.id);
    await createAdminNotification(`Symptom '${symptom.name}' has been successfully deleted`, "delete");
    res.json({ message: "Symptom Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};