// src/routes/analyticsRoutes.js
import express from 'express';
import { getVendorAnalytics, getStoreAnalytics } from '../controllers/analyticsController.js';
import protect from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Vendor Analytics - Vendor or SuperAdmin can access
router.get('/vendor/:vendorId', protect, authorizeRoles('vendor', 'superAdmin'), getVendorAnalytics);

// Store Analytics - Vendor or SuperAdmin can access
router.get('/store/:storeId', protect, authorizeRoles('vendor', 'superAdmin'), getStoreAnalytics);

export default router;
