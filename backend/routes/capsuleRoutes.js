import { createCapsule, getCapsules, deleteCapsule, getCapsuleById, updateCapsule } from '../controllers/capsuleController.js'; 
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import express from 'express';
const router = express.Router();

router.route('/')
  .post(verifyToken, upload.array('files', 10), createCapsule)
  .get(verifyToken, getCapsules);

router.route('/:id')
  .get(verifyToken, getCapsuleById)
  .put(verifyToken, upload.array('files', 10), updateCapsule)
  .delete(verifyToken, deleteCapsule);

export default router;