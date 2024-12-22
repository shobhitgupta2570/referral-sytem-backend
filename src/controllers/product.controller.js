import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Product } from '../models/product.model.js';

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description } = req.body;

  const product = new Product({
    name,
    price,
    description
  });

  await product.save();
  res.status(201).json({ message: "Product created successfully", product });
});

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  if (!products) throw new ApiError(404, "No products found");

  res.status(200).json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  res.status(200).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { name, price, description } = req.body;

  const product = await Product.findByIdAndUpdate(
    productId,
    { name, price, description },
    { new: true, runValidators: true }
  );

  if (!product) throw new ApiError(404, "Product not found");

  res.status(200).json({ message: "Product updated successfully", product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findByIdAndDelete(productId);
  if (!product) throw new ApiError(404, "Product not found");

  res.status(200).json({ message: "Product deleted successfully" });
});

export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
