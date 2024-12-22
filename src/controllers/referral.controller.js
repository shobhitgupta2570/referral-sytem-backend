import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Referral } from '../models/referral.model.js';
import { User} from '../models/user.model.js';

const addReferral = asyncHandler(async (req, res) => {
  const { userId, referredUserId } = req.body;

  const referredUser = await User.findById(referredUserId);
  if (!referredUser) throw new ApiError(404, "Referred user does not exist");

  const referral = new Referral({
    userId,
    referredUserId
  });

  await referral.save();

  res.status(201).json({ message: "Referral added successfully", referral });
});

const getUserReferrals = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const referrals = await Referral.find({ userId }).populate('referredUserId');
  if (!referrals) throw new ApiError(404, "No referrals found for this user");

  res.status(200).json(referrals);
});

export { addReferral, getUserReferrals };
