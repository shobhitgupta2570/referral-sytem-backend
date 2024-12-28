import { Router } from 'express';
import { createPurchase, getUserPurchases, getPurchaseHistory } from '../controllers/purchase.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/').post(verifyJWT, createPurchase);
// router.route('/:userId').get(verifyJWT, getUserPurchases);
// Route to get purchase history
router.route('/history').get(verifyJWT, getPurchaseHistory);

export default router;
