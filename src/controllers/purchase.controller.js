import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Purchase } from '../models/purchase.model.js';
import { User } from '../models/user.model.js';
import { Product } from '../models/product.model.js';
import { handleEarnings } from '../services/earningService.js';

const createPurchase = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { productId, purchaseAmount } = req.body;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  const purchase = new Purchase({
    userId,
    productId,
    purchaseAmount,
    purchaseDate: new Date()
  });

  await purchase.save();

  // Handle earnings distribution
  await handleEarnings(userId, purchaseAmount);

  res.status(201).json({ message: "Purchase created successfully", purchase });
});

const getUserPurchases = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const purchases = await Purchase.find({ userId }).populate('productId');
  if (!purchases) throw new ApiError(404, "No purchases found for this user");

  res.status(200).json(purchases);
});

const getPurchaseHistory = asyncHandler(async (req, res) => {
  const parentUserId = req.user._id;
  const { page = 1, limit = 10, type = 'direct' } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    populate: 'userId productId',
    lean: true,
    sort: { purchaseDate: -1 }
  };

  let purchases;
  if (type === 'direct') {
    const directReferralIds = await User.find({ parentId: parentUserId }).select('_id').lean();
    purchases = await Purchase.paginate({ userId: { $in: directReferralIds.map(ref => ref._id) } }, options);
  } else {
    const directReferralIds = await User.find({ parentId: parentUserId }).select('_id').lean();
    const indirectReferralIds = await User.find({ parentId: { $in: directReferralIds.map(ref => ref._id) } }).select('_id').lean();
    purchases = await Purchase.paginate({ userId: { $in: indirectReferralIds.map(ref => ref._id) } }, options);
  }

  // Calculate earnings and add to purchase data
  const calculateEarnings = (purchase, percentage) => {
    const earnedAmount = purchase.purchaseAmount * percentage;
    return {
      ...purchase,
      earnedAmount,
      percentage: percentage * 100
    };
  };

  const updatedPurchases = purchases.docs.map(purchase => {
    const percentage = type === 'direct' ? 0.05 : 0.01;
    return calculateEarnings(purchase, percentage);
  });

  res.status(200).json({
    docs: updatedPurchases,
    totalPages: purchases.totalPages,
    page: purchases.page
  });
});

export { createPurchase, getUserPurchases, getPurchaseHistory };

