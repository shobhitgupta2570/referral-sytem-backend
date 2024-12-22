import { Router } from 'express';
import { createPurchase, getUserPurchases } from '../controllers/purchase.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/').post(verifyJWT, createPurchase);
router.route('/:userId').get(verifyJWT, getUserPurchases);

export default router;
