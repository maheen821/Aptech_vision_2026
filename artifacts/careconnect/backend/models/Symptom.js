import mongoose from "mongoose";

const symptomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  specialties: [String ],
  keywords: [String],
});

export default mongoose.model("Symptom", symptomSchema);