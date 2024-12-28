import { asyncHandler } from '../utils/asyncHandler.js';
import { Earning } from '../models/earning.model.js';

const getEarningsReport = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Total Earnings
  const totalEarnings = await Earning.aggregate([
    { $match: { userId } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  // Earnings Over Time
  const earningsOverTime = await Earning.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } },
        total: { $sum: "$amount" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    {
      $project: {
        _id: 0,
        date: { $concat: [{ $toString: "$_id.year" }, "-", { $toString: "$_id.month" }, "-", { $toString: "$_id.day" }] },
        total: 1
      }
    }
  ]);

  res.status(200).json({
    totalEarnings: totalEarnings[0]?.total || 0,
    earningsOverTime
  });
});

export { getEarningsReport };






// import { asyncHandler } from '../utils/asyncHandler.js';
// import { Earning } from '../models/earning.model.js';
// import { Purchase } from '../models/purchase.model.js';
// import { User } from '../models/user.model.js';

// const getEarningsReport = asyncHandler(async (req, res) => {
//   const userId = req.user._id;

//   // Total Earnings
//   const totalEarnings = await Earning.aggregate([
//     { $match: { userId } },
//     { $group: { _id: null, total: { $sum: "$amount" } } }
//   ]);

//   // Earnings Over Time
//   const earningsOverTime = await Earning.aggregate([
//     { $match: { userId } },
//     { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, total: { $sum: "$amount" } } },
//     { $sort: { "_id": 1 } }
//   ]);

//   res.status(200).json({
//     totalEarnings: totalEarnings[0]?.total || 0,
//     earningsOverTime
//   });
// });

// export { getEarningsReport };




// import { asyncHandler } from '../utils/asyncHandler.js';
// import { ApiError } from '../utils/ApiError.js';
// import { Earning } from '../models/earning.model.js';

// const getEarningsHistory = asyncHandler(async (req, res) => {
//   const { userId } = req.params;

//   const earnings = await Earning.find({ userId }).sort({ createdAt: -1 });
//   if (!earnings) throw new ApiError(404, "No earnings history found for this user");

//   res.status(200).json(earnings);
// });

// const generateProfitReport = asyncHandler(async (req, res) => {
//   const { userId } = req.params;

//   const earnings = await Earning.find({ userId });
//   const totalEarnings = earnings.reduce((total, earning) => total + earning.amount, 0);

//   res.status(200).json({ totalEarnings, earnings });
// });

// export { getEarningsHistory, generateProfitReport };
