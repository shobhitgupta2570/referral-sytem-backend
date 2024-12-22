import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { Referral } from '../models/referral.model.js';
import { Earning } from '../models/earning.model.js';

const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const totalEarnings = await Earning.aggregate([
    { $match: { userId: userId } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  const referralsCount = await Referral.countDocuments({ userId: userId });

  const recentTransactions = await Earning.find({ userId: userId })
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    totalEarnings: totalEarnings[0]?.total || 0,
    referrals: referralsCount,
    transactions: recentTransactions,
  });
});

export { getDashboardData };
