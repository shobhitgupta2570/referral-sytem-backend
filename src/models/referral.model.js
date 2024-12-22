import mongoose, { Schema } from 'mongoose';

const referralSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    referredUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

// Pre-save hook to limit referrals to 8 per user
referralSchema.pre('save', async function (next) {
  const userId = this.userId;
  const count = await mongoose.model('Referral').countDocuments({ userId });

  if (count >= 8) {
    const err = new Error('User cannot have more than 8 referrals.');
    next(err);
  } else {
    next();
  }
});

export const Referral = mongoose.model('Referral', referralSchema);
