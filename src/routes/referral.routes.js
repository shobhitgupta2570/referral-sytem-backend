import { Router } from 'express';
import { addReferral, getUserReferrals } from '../controllers/referral.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/add').post(verifyJWT, addReferral);
router.route('/:userId/referrals').get(verifyJWT, getUserReferrals);

export default router;
