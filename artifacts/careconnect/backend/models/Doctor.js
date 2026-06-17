import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
      specialty: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    fee: { type: Number, default: 0 },

    available: { type: Boolean, default: true },

    imageUrl: {
      type: String,
      default: "/images/doctor-fallback.jpg",
    },

    location: { type: String, default: "" },
    bio: { type: String, default: "" },

    // ⭐ ADD THESE (IMPORTANT)

    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],

    timings: [
      {
        day: String,
        time: String,
      },
    ],

    treatments: [String],

    reviews: [
      {
        name: String,
        rating: Number,
        comment: String,
        date: String,
      },
    ],

    successRate: {
      type: Number,
      default: 95,
    },

    patientsTreated: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Doctor", doctorSchema);