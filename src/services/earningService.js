import { User } from '../models/user.model.js';
import { Earning } from '../models/earning.model.js';
import { io } from '../app.js';

const handleEarnings = async (referredUserId, purchaseAmount) => {
  if (purchaseAmount <= 1000) return;

  const referredUser = await User.findById(referredUserId);
  if (!referredUser) throw new Error('Referred user not found');

  const parentUser = await User.findById(referredUser.parentId);

  if (!parentUser) {
    console.log('No parent user found. Purchase made without a referral.');
    return;
  }

  const directEarning = purchaseAmount * 0.05;
  await User.findByIdAndUpdate(
    parentUser._id,
    { $inc: { totalEarnings: directEarning } },
    { new: true }
  );

  const directEarningRecord = new Earning({
    userId: parentUser._id,
    amount: directEarning,
    level: 1
  });
  await directEarningRecord.save();

  io.to(parentUser._id.toString()).emit('notification', {
    type: 'earning',
    message: `You earned Rs. ${directEarning.toFixed(2)} from a referral!`,
    totalEarnings: parentUser.totalEarnings + directEarning
  });

  if (parentUser.parentId) {
    const grandParentUser = await User.findById(parentUser.parentId);
    if (grandParentUser) {
      const indirectEarning = purchaseAmount * 0.01;
      await User.findByIdAndUpdate(
        grandParentUser._id,
        { $inc: { totalEarnings: indirectEarning } },
        { new: true }
      );

      const indirectEarningRecord = new Earning({
        userId: grandParentUser._id,
        amount: indirectEarning,
        level: 2
      });
      await indirectEarningRecord.save();

      io.to(grandParentUser._id.toString()).emit('notification', {
        type: 'earning',
        message: `You earned Rs. ${indirectEarning.toFixed(2)} from an indirect referral!`,
        totalEarnings: grandParentUser.totalEarnings + indirectEarning
      });
    }
  }
};

export { handleEarnings };
