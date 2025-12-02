import { createCapsule, getCapsules } from '../controllers/capsuleController.js'; 

import express from 'express';
const router = express.Router();

router.route('/')
  .post(createCapsule)
  .get(getCapsules);

export default router;