import Doctor from "../models/Doctor.js"; // 👈 Yeh import lazmi add karein
import { createAdminNotification } from "../utils/notificationHelper.js";

export const addDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    await createAdminNotification(`New Doctor has been registered: Dr. ${doctor.fullName}`, "add");
    res.status(201).json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await createAdminNotification(`Dr. ${doctor.fullName} profile has been successfully updated`, "update");
    res.json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    await createAdminNotification(`Dr. ${doctor.fullName} has been successfully deleted`, "delete");
    res.json({ message: "Doctor Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};