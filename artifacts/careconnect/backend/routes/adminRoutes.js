import express from "express";
import Doctor from "../models/Doctor.js"; 
import Symptom from "../models/Symptom.js";
import Specialty from "../models/Specialty.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import {
 addCategory,
 updateCategory,
 deleteCategory
} from "../controllers/categoryController.js";
import {
 addDoctor,
 updateDoctor,
 deleteDoctor
} from "../controllers/doctorController.js";
import{
    addSpecialty,
    updateSpecialty,
    deleteSpecialty
} from "../controllers/specialtyController.js";


const router = express.Router();

router.get("/dashboard-stats", async (req, res) => {
  try {
    const [totalDoctors, totalSymptoms, totalSpecialties, totalCategories, totalUsers] = await Promise.all([
      Doctor.countDocuments(),
      Symptom.countDocuments(),
      Specialty.countDocuments(),
      Category.countDocuments(),
      User.countDocuments()
    ]);

    const chartData = [
      { name: "Doctors", total: totalDoctors },
      { name: "Symptoms", total: totalSymptoms },
      { name: "Specialties", total: totalSpecialties },
      { name: "Categories", total: totalCategories },
    ];

    res.json({
      summary: { totalDoctors, totalSymptoms, totalSpecialties, totalCategories, totalUsers },
      chartData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// GET: Fetch latest 10 notifications
router.get("/notifications", async (req, res) => {
  try {
    // Database se notifications uthane ki koshish
    const notifications = await Notification.find()
      .sort({ createdAt: -1 }) // Latest upar aayegi
      .limit(10);
      
    return res.status(200).json(notifications);
  } catch (error) {
    // 🔥 Yeh crash aapke VS Code ke terminal (jahan nodemon chal raha hai) par dikhega
    console.log("❌ NOTIFICATION ROUTE CRASH DETECTED:");
    console.error(error);
    
    return res.status(500).json({ 
      message: "Backend par query fail ho gayi", 
      error: error.message 
    });
  }
});
router.delete("/notifications/:id", async (req, res) => {
  try {
   await Notification.findByIdAndDelete(req.params.id); //  Sahi model jo line number 7 par imported hai
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;