import express from "express";
const router = express.Router();

// GOOGLE LOGIN ROUTE
router.post("/google", async (req, res) => {
  try {
    const { name, email, photo } = req.body;

    console.log("Google user:", req.body);

    // fake response (abhi database optional)
    res.json({
      user: {
        _id: "123",
        fullName: name,
        email,
        photo,
      },
      token: "demo-token",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;