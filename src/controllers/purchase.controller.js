import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Purchase } from '../models/purchase.model.js';
import {User} from '../models/user.model.js';
import { Product } from '../models/product.model.js';
import { handleEarnings } from '../services/earningService.js';

const createPurchase = asyncHandler(async (req, res) => {
  const { _id:userId} = req.user;
  console.log(req.user)
  const {  productId, purchaseAmount } = req.body;

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
  const { userId } = req.params;

  const purchases = await Purchase.find({ userId }).populate('productId');
  if (!purchases) throw new ApiError(404, "No purchases found for this user");

  res.status(200).json(purchases);
});

export { createPurchase, getUserPurchases };
