// src/routes/index.js
import { Router } from 'express';
import authRoutes from './authRoutes.js';
import vendorRoutes from './vendorRoutes.js';
import storeRoutes from './storeRoutes.js';
import surpriseBagRoutes from './surpriseBagRoutes.js';
import orderRoutes from './orderRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/vendors', vendorRoutes);
router.use('/stores', storeRoutes);
router.use('/surprise-bags', surpriseBagRoutes);
router.use('/orders', orderRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes); // Include analytics routes here

export default router;
