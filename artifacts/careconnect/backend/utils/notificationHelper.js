import Notification from "../models/Notification.js"; // 👈 Check karein path bilkul sahi ho

export const createAdminNotification = async (text, type) => {
  try {
    // Database mein save karne ka sahi method
    const newNotification = new Notification({ text, type });
    await newNotification.save();
    
    console.log(`🟢 SUCCESS: Notification DB mein save ho gayi -> [${type}] ${text}`);
  } catch (error) {
    // ❌ Agar koi galti hogi toh backend terminal par error print ho jayega
    console.log("🔴 ERROR: Notification create karne mein galti hui:");
    console.error(error.message);
  }
};