// src/routes/notificationRoutes.js
import { Router } from 'express';
import { sendNotification, getUserNotifications, markNotificationAsRead } from '../controllers/notificationController.js';
import protect from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', protect, sendNotification);
router.get('/user', protect, getUserNotifications);
router.put('/:notificationId/read', protect, markNotificationAsRead);

export default router;
