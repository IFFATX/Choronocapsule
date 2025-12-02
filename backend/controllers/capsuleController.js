import asyncHandler from 'express-async-handler';
import Capsule from '../models/capsuleModel.js';


const createCapsule = asyncHandler(async (req, res) => {
  const { title, description, releaseDate } = req.body;

  if (!title || !description || !releaseDate) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }


  const capsule = await Capsule.create({
    title,
    description,
    releaseDate,
    status: 'draft',
    // owner: req.user.id, {uncomment after  Auth Middleware implement}
  });

  res.status(201).json(capsule);
});


const getCapsules = asyncHandler(async (req, res) => {

  // const capsules = await Capsule.find(); 
  

  // const capsules = await Capsule.find({ owner: req.user.id });
  
  const capsules = await Capsule.find();
  res.status(200).json(capsules);
});

export { createCapsule, getCapsules };