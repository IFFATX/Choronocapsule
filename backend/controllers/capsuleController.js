import asyncHandler from 'express-async-handler';
import Capsule from '../models/capsuleModel.js';


const createCapsule = asyncHandler(async (req, res) => {
  const { title, description, releaseDate } = req.body;

  if (!title || !description || !releaseDate) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  let files = [];
  if (req.files) {
    files = req.files.map((file) => file.path.replace(/\\/g, "/"));
  }

  const capsule = await Capsule.create({
    title,
    description,
    releaseDate,
    status: 'draft',
    files,
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

const getCapsuleById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const capsule = await Capsule.findOne({ _id: id, owner: req.user.id });

  if (!capsule) {
    res.status(404);
    throw new Error('Capsule not found');
  }

  res.status(200).json(capsule);
});

const updateCapsule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, releaseDate, remainingFiles } = req.body;

  const capsule = await Capsule.findOne({ _id: id, owner: req.user.id });

  if (!capsule) {
    res.status(404);
    throw new Error('Capsule not found');
  }

  let updatedFiles = [];
  
  // Handle remaining files (could be string or array)
  if (remainingFiles) {
    updatedFiles = Array.isArray(remainingFiles) ? remainingFiles : [remainingFiles];
  }
  
  // Add new files
  if (req.files) {
    const newFiles = req.files.map((file) => file.path.replace(/\\/g, "/"));
    updatedFiles = [...updatedFiles, ...newFiles];
  }

  capsule.title = title || capsule.title;
  capsule.description = description || capsule.description;
  capsule.releaseDate = releaseDate || capsule.releaseDate;
  capsule.files = updatedFiles;

  const updatedCapsule = await capsule.save();

  res.status(200).json(updatedCapsule);
});

export { createCapsule, getCapsules, deleteCapsule, getCapsuleById, updateCapsule };