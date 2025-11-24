import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.send("Auth route working!");
});

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
