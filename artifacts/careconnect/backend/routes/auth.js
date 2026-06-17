import express from "express";
import User from "../models/User.js";

const router = express.Router();


// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // CHECK EMAIL
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // CREATE USER
    const user = await User.create({
      fullName,
      email,
      phone,
      password,
    });

    // RESPONSE
    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // USER FIND
    const user = await User.findOne({
      $or: [
        { email: emailOrPhone },
        { phone: emailOrPhone },
      ],
    });

    // USER NOT FOUND
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // PASSWORD CHECK
    if (user.password !== password) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // SUCCESS LOGIN
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


// ✅ GET ALL USERS
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;