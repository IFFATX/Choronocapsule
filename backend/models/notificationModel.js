import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    capsule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Capsule',
      required: false,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['capsule_unlocked', 'capsule_reminder', 'achievement', 'system'],
      default: 'capsule_unlocked',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Notification', notificationSchema);
