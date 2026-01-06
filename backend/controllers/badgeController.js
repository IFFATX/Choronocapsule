import asyncHandler from 'express-async-handler';
import User from '../models/user.js';
import Capsule from '../models/capsuleModel.js';
import Notification from '../models/notificationModel.js';
import { BADGES, checkBadges } from '../config/badges.js';

// Get user's badges
const getUserBadges = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('badges');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Get badge details
  const badgeDetails = user.badges.map(badgeId => {
    return Object.values(BADGES).find(b => b.id === badgeId);
  }).filter(Boolean);
  
  res.status(200).json(badgeDetails);
});

// Check and award new badges
const checkAndAwardBadges = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  // Get user capsules
  const capsules = await Capsule.find({ owner: userId });
  
  // Calculate stats
  const totalCapsules = capsules.length;
  const releasedCapsules = capsules.filter(c => c.status === 'released').length;
  
  // Calculate longest wait (already released capsule)
  let longestWaitDays = 0;
  const now = new Date();
  capsules.forEach(capsule => {
    if (capsule.status === 'released') {
      const waitTime = new Date(capsule.releaseDate) - new Date(capsule.createdAt);
      const days = Math.floor(waitTime / (1000 * 60 * 60 * 24));
      if (days > longestWaitDays) longestWaitDays = days;
    }
  });
  
  // Calculate longest future wait (draft/locked capsules)
  let longestFutureWaitDays = 0;
  capsules.forEach(capsule => {
    if (capsule.status === 'draft' || capsule.status === 'locked') {
      const waitTime = new Date(capsule.releaseDate) - new Date(capsule.createdAt);
      const days = Math.floor(waitTime / (1000 * 60 * 60 * 24));
      if (days > longestFutureWaitDays) longestFutureWaitDays = days;
    }
  });
  
  // Calculate max capsules in one day
  const capsulesByDate = {};
  capsules.forEach(capsule => {
    const date = new Date(capsule.createdAt).toDateString();
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
    
    // Return new badge details
    const newBadgeDetails = newBadges.map(badgeId => {
      return Object.values(BADGES).find(b => b.id === badgeId);
    }).filter(Boolean);
    
    res.status(200).json({ 
      newBadges: newBadgeDetails,
      message: `Congratulations! You earned ${newBadges.length} new badge(s)!`
    });
  } else {
    res.status(200).json({ 
      newBadges: [],
      message: 'No new badges earned'
    });
  }
});

// Get all available badges
const getAllBadges = asyncHandler(async (req, res) => {
  const allBadges = Object.values(BADGES);
  res.status(200).json(allBadges);
});

export { getUserBadges, checkAndAwardBadges, getAllBadges };
