import mongoose from "mongoose";

const specialtySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  category: String,
});

export default mongoose.model("Specialty", specialtySchema);