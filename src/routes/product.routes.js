import { Router } from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/').post(verifyJWT, createProduct).get(getAllProducts);
router.route('/:productId').get(getProductById).patch(verifyJWT, updateProduct).delete(verifyJWT, deleteProduct);

export default router;
