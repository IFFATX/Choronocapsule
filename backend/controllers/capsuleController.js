import asyncHandler from 'express-async-handler';
import Capsule from '../models/capsuleModel.js';
import User from '../models/user.js';
import Notification from '../models/notificationModel.js';
import { BADGES, checkBadges } from '../config/badges.js';


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

  // Auto-check for new badges after creating capsule
  try {
    const userId = req.user.id;
    const capsules = await Capsule.find({ owner: userId });
    
    // Calculate stats
    const totalCapsules = capsules.length;
    const releasedCapsules = capsules.filter(c => c.status === 'released').length;
    
    // Calculate longest wait (already released)
    let longestWaitDays = 0;
    capsules.forEach(c => {
      if (c.status === 'released') {
        const waitTime = new Date(c.releaseDate) - new Date(c.createdAt);
        const days = Math.floor(waitTime / (1000 * 60 * 60 * 24));
        if (days > longestWaitDays) longestWaitDays = days;
      }
    });
    
    // Calculate longest future wait (draft/locked)
    let longestFutureWaitDays = 0;
    capsules.forEach(c => {
      if (c.status === 'draft' || c.status === 'locked') {
        const waitTime = new Date(c.releaseDate) - new Date(c.createdAt);
        const days = Math.floor(waitTime / (1000 * 60 * 60 * 24));
        if (days > longestFutureWaitDays) longestFutureWaitDays = days;
      }
    });
    
    // Calculate max capsules in one day
    const capsulesByDate = {};
    capsules.forEach(c => {
      const date = new Date(c.createdAt).toDateString();
      capsulesByDate[date] = (capsulesByDate[date] || 0) + 1;
    });
    const maxCapsulesInOneDay = Math.max(...Object.values(capsulesByDate), 0);
    
    const userStats = {
      totalCapsules,
      releasedCapsules,
      longestWaitDays,
      longestFutureWaitDays,
      maxCapsulesInOneDay
    };
    
    // Check which badges should be earned
    const earnedBadgeIds = checkBadges(userStats);
    
    // Get current user badges
    const user = await User.findById(userId);
    const currentBadges = user.badges || [];
    
    // Find new badges
    const newBadges = earnedBadgeIds.filter(badgeId => !currentBadges.includes(badgeId));
    
    // Award new badges
    if (newBadges.length > 0) {
      user.badges = [...currentBadges, ...newBadges];
      await user.save();
      
      // Create notifications for each new badge
      for (const badgeId of newBadges) {
        const badgeInfo = Object.values(BADGES).find(b => b.id === badgeId);
        if (badgeInfo) {
          await Notification.create({
            user: userId,
            type: 'achievement',
            message: `🎉 Achievement Unlocked: ${badgeInfo.name}! ${badgeInfo.description}`,
            isRead: false
          });
        }
      }
    }
  } catch (badgeError) {
    console.error('Error checking badges:', badgeError);
    // Don't fail capsule creation if badge check fails
  }

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