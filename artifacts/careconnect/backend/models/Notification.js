import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    type: { type: String, enum: ["add", "update", "delete"], required: true },
  },
  { timestamps: true } // 👈 Yeh automatic createdAt aur updatedAt bana deta hai
);

// Mongoose model banate waqt check karein ke spelling sahi ho
const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;