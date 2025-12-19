import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import capsuleRoutes from './routes/capsuleRoutes.js';

dotenv.config();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// root fix
app.get("/", (req, res) => {
  res.send("Backend running for Chrono Capsule!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/capsules', capsuleRoutes);

// Connect to MongoDB (Atlas)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connecteeeeeeed!!!");
    // Start server only after DB connects
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT} !!!!!`);
    });
  })
  .catch((err) => {
    console.log("xxxx MongoDB connection errooooor xxx:", err.message);
  });

