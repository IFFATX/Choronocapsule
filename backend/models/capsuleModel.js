import mongoose from 'mongoose';

const capsuleSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add text content'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Please add a release date'],
    },
    status: {
      type: String,
      enum: ['draft', 'locked', 'released'],
      default: 'draft',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide owner'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Capsule', capsuleSchema);