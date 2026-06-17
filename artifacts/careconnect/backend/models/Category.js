import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  icon: String,

  color: String,

  keywords: [String],
});

export default mongoose.model("Category", categorySchema);