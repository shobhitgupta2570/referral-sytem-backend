import mongoose, { Schema } from 'mongoose';

const earningSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    level: {
      type: Number,
      required: true,
      enum: [1, 2], // Level 1 or Level 2
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Earning = mongoose.model('Earning', earningSchema);
