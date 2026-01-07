import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import capsuleRoutes from './routes/capsuleRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import badgeRoutes from './routes/badgeRoutes.js';
import { startNotificationService } from './services/notificationService.js';

dotenv.config();

// 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// root fix
app.get("/", (req, res) => {
  res.send("Backend running for Chrono Capsule!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/capsules', capsuleRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/badges', badgeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});


// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connecteeeeeeed!!!");
      
     
      startNotificationService();
      
      // Start server only after DB connects
      app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT} !!!!!`);
      });
    })
    .catch((err) => {
      console.log("xxxx MongoDB connection errooooor xxx:", err.message);
    });
}

// Export app for testing
export default app;

