import Capsule from '../models/capsuleModel.js';
import Notification from '../models/notificationModel.js';

// Check for unlocked capsules and create notifications
export const checkUnlockedCapsules = async () => {
  try {
    const now = new Date();
    
    // Find capsules that should be unlocked (release date passed and still locked)
    const capsulestoUnlock = await Capsule.find({
      releaseDate: { $lte: now },
      status: { $in: ['draft', 'locked'] }
    });
    
    for (const capsule of capsulestoUnlock) {
      // Skip if capsule doesn't have an owner
      if (!capsule.owner) {
        console.log(`⚠️ Skipping capsule "${capsule.title}" - no owner found`);
        continue;
      }
      
      // Update capsule status to released (without validation)
      await Capsule.updateOne(
        { _id: capsule._id },
        { $set: { status: 'released' } }
      );
      
      // Check if notification already exists for this capsule
      const existingNotification = await Notification.findOne({
        capsule: capsule._id,
        user: capsule.owner,
        type: 'capsule_unlocked'
      });
      
      // Create notification if it doesn't exist
      if (!existingNotification) {
        await Notification.create({
          user: capsule.owner,
          capsule: capsule._id,
          message: `Your capsule "${capsule.title}" has been unlocked! 🎉`,
          type: 'capsule_unlocked',
          isRead: false
        });
      }
    }
  } catch (error) {
    console.error('Error checking unlocked capsules:', error);
  }
};

// Run the check every minute (you can adjust the interval)
export const startNotificationService = () => {
  // Run immediately on startup
  checkUnlockedCapsules();
  
  // Then run every 1 minute (60000 ms)
  setInterval(checkUnlockedCapsules, 60000);
};
