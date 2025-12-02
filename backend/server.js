import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// root fix
app.get("/", (req, res) => {
  res.send("Backend running for Chrono Capsule!");
});

// Routes
app.use("/api/auth", authRoutes);

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

