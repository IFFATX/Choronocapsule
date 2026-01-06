import asyncHandler from 'express-async-handler';
import Notification from '../models/notificationModel.js';

// Get all notifications for a user
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id })
    .populate('capsule', 'title')
    .sort({ createdAt: -1 })
    .limit(20);
  
  res.status(200).json(notifications);
});

// Get unread notification count
const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ 
    user: req.user.id, 
    isRead: false 
  });
  
  res.status(200).json({ count });
});

// Mark notification as read
const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const notification = await Notification.findOne({ 
    _id: id, 
    user: req.user.id 
  });
  
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }
  
  notification.isRead = true;
  await notification.save();
  
  res.status(200).json(notification);
});

// Mark all notifications as read
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user.id, isRead: false },
    { isRead: true }
  );
  
  res.status(200).json({ message: 'All notifications marked as read' });
});

// Delete a notification
const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const notification = await Notification.findOne({ 
    _id: id, 
    user: req.user.id 
  });
  
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }
  
  await Notification.findByIdAndDelete(id);
  
  res.status(200).json({ message: 'Notification deleted' });
});

export { 
  getNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead,
  deleteNotification 
};
