import { createCapsule, getCapsules, deleteCapsule } from '../controllers/capsuleController.js'; 
import { verifyToken } from '../middleware/authMiddleware.js';
import express from 'express';
const router = express.Router();

router.route('/')
  .post(verifyToken, createCapsule)
  .get(verifyToken, getCapsules);

router.route('/:id')
  .delete(verifyToken, deleteCapsule);

export default router;