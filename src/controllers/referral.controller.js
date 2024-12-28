import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Referral } from '../models/referral.model.js';
import { User } from '../models/user.model.js';

const addReferral = asyncHandler(async (req, res) => {
  const { referredUserEmail } = req.body;
  const userId = req.user._id; // Extract userId from the token

  const referredUser = await User.findOne({ email: referredUserEmail });
  if (!referredUser) throw new ApiError(404, "Referred user does not exist");

  const referral = new Referral({
    userId,
    referredUserId: referredUser._id
  });

  await referral.save();

  // Update the parentId of the referred user
  referredUser.parentId = userId;
  await referredUser.save();

  res.status(201).json({ message: "Referral added successfully", referral });
});

const getUserReferrals = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Extract userId from the token

  const referrals = await Referral.find({ userId }).populate('referredUserId');
  if (!referrals) throw new ApiError(404, "No referrals found for this user");

  res.status(200).json(referrals);
});

const getReferralsHierarchy = asyncHandler(async (req, res) => {
  const parentUserId = req.user._id;

  // Fetch direct referrals of the current user
  const directReferrals = await User.find({ parentId: parentUserId }).lean();

  // Prepare the response structure
  const result = {
    userId: parentUserId,
    directReferrals: directReferrals.map(referral => ({
      ...referral,
      indirectReferrals: []
    }))
  };

  // Fetch indirect referrals for each direct referral
  for (const directReferral of result.directReferrals) {
    const indirectReferrals = await User.find({ parentId: directReferral._id }).lean();
    directReferral.indirectReferrals = indirectReferrals || [];
  }

  res.status(200).json(result);
});


export { addReferral, getUserReferrals, getReferralsHierarchy };

