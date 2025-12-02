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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Capsule', capsuleSchema);