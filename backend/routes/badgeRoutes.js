import express from 'express';
import { getUserBadges, checkAndAwardBadges, getAllBadges } from '../controllers/badgeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-badges', protect, getUserBadges);
router.post('/check-badges', protect, checkAndAwardBadges);
router.get('/all-badges', protect, getAllBadges);

export default router;
