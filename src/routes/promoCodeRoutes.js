import express from 'express';
import { createPromoCode, applyPromoCode } from '../controllers/promoCodeController.js';
import protect from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Create a promo code (Admin only)
router.post('/', protect, authorizeRoles('superAdmin'), createPromoCode);

// Apply a promo code (User authentication)
router.post('/apply', protect, applyPromoCode);

export default router;
