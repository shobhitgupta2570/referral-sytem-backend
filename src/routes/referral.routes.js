import express from 'express';
import { getReferralsHierarchy, getUserReferrals, addReferral } from '../controllers/referral.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/hierarchy', verifyJWT, getReferralsHierarchy);
router.get('/list', verifyJWT, getUserReferrals);
router.post('/add', verifyJWT, addReferral);

export default router;


