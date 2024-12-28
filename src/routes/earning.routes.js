import express from 'express';
import { getEarningsReport } from '../controllers/earning.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/report', verifyJWT, getEarningsReport);

export default router;







// import { Router } from 'express';
// import { getEarningsHistory, generateProfitReport } from '../controllers/earning.controller.js';
// import { verifyJWT } from '../middlewares/auth.middleware.js';

// const router = Router();

// router.route('/history/:userId').get(verifyJWT, getEarningsHistory);
// router.route('/report/:userId').get(verifyJWT, generateProfitReport);

// export default router;
