import Specialty from "../models/Specialty.js"; // 👈 Yeh import lazmi add karein
import { createAdminNotification } from "../utils/notificationHelper.js";

export const addSpecialty = async (req, res) => {
  try {
    const specialty = await Specialty.create(req.body);
    await createAdminNotification(`New specialty has been added: ${specialty.name}`, "add");
    res.status(201).json(specialty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSpecialty = async (req, res) => {
  try {
    const specialty = await Specialty.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await createAdminNotification(`Specialty '${specialty.name}' has been successfully updated`, "update");
    res.json(specialty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSpecialty = async (req, res) => {
  try {
    const specialty = await Specialty.findByIdAndDelete(req.params.id);
    await createAdminNotification(`Specialty '${specialty.name}' has been successfully deleted`, "delete");
    res.json({ message: "Specialty Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};