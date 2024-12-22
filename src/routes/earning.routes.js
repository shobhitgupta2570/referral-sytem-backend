import { Router } from 'express';
import { getEarningsHistory, generateProfitReport } from '../controllers/earning.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/history/:userId').get(verifyJWT, getEarningsHistory);
router.route('/report/:userId').get(verifyJWT, generateProfitReport);

export default router;
