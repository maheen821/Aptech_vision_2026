import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import symptomRoutes from "./routes/symptomRoutes.js";
import analyzeRoutes from "./routes/analyzeRoutes.js";
import specialtyRoutes from "./routes/specialties.js";
import categoryRoutes from "./routes/categories.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// ───── DB CONNECTION ─────
connectDB();

// ───── MIDDLEWARE ─────
app.use(cors({
  origin: "*",          // development ke liye sabko allow
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// ───── STATIC FOLDER (IMAGE ACCESS) ─────
app.use("/uploads", express.static("uploads"));

// ───── MULTER SETUP (IMAGE UPLOAD) ─────
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });


// ───── APPLICATION ROUTES ─────
app.use("/api/specialties", specialtyRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/admin", adminRoutes);       // ✅ Ab yeh sahi target hoga!
app.use("/api/auth", authRoutes);         // ✅ Google login route


// ───── HOME ROUTE ─────
app.get("/", (req, res) => {
  res.send("CareConnect Backend Running 🚀");
});


// ─────────────────────────────
// ✅ REGISTER USER
// ─────────────────────────────
app.post("/api/auth/register", async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      fullName,
      email,
      phone,
      password,
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// ─────────────────────────────
// ✅ LOGIN USER
// ─────────────────────────────
app.post("/api/auth/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const user = await User.findOne({
      $or: [
        { email: emailOrPhone },
        { phone: emailOrPhone },
      ],
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// ─────────────────────────────
// 📖 GET ALL USERS
// ─────────────────────────────
app.get("/api/auth/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// ─────────────────────────────
// 👤 GET SINGLE USER
// ─────────────────────────────
app.get("/api/auth/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ───── SERVER START ─────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});