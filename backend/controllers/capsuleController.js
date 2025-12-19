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
    owner: req.user.id,
  });

  res.status(201).json(capsule);
});


const getCapsules = asyncHandler(async (req, res) => {
  const capsules = await Capsule.find({ owner: req.user.id });
  res.status(200).json(capsules);
});

const deleteCapsule = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const capsule = await Capsule.findOne({ _id: id, owner: req.user.id });

  if (!capsule) {
    res.status(404);
    throw new Error('Capsule not found or unauthorized');
  }

  await Capsule.findByIdAndDelete(id);

  res.status(200).json({ message: 'Capsule deleted successfully', capsule });
});

export { createCapsule, getCapsules, deleteCapsule };