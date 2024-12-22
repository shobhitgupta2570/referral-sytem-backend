import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Earning } from '../models/earning.model.js';

const getEarningsHistory = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const earnings = await Earning.find({ userId }).sort({ createdAt: -1 });
  if (!earnings) throw new ApiError(404, "No earnings history found for this user");

  res.status(200).json(earnings);
});

const generateProfitReport = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const earnings = await Earning.find({ userId });
  const totalEarnings = earnings.reduce((total, earning) => total + earning.amount, 0);

  res.status(200).json({ totalEarnings, earnings });
});

export { getEarningsHistory, generateProfitReport };
