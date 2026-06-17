import express from "express";
import {
  createSymptom,
  getSymptoms,
  updateSymptom,
  deleteSymptom
} from "../controllers/adminSymptomController.js";

const router = express.Router();

router.get("/", getSymptoms);
router.post("/", createSymptom);
router.put("/:id", updateSymptom);
router.delete("/:id", deleteSymptom);

export default router;