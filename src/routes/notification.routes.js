import express from 'express';
import { getNotifications, markNotificationAsRead } from '../controllers/notification.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', verifyJWT, getNotifications);
router.patch('/:id', verifyJWT, markNotificationAsRead);

export default router;
