// src/routes/orderRoutes.js
import express from 'express';
import {
  placeOrder,
  updateOrderStatus,
  getOrdersForUser,
  getOrdersForVendor,
  verifyOrderPickup,
  initiatePayment,
  confirmPayment,
  getOrdersByStatus,
} from '../controllers/orderController.js';
import protect from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, placeOrder);
router.put('/:orderId/status', protect, authorizeRoles('vendor', 'superAdmin'), updateOrderStatus);
router.get('/', protect, getOrdersForUser);
router.get('/vendor/:storeId', protect, authorizeRoles('vendor', 'superAdmin'), getOrdersForVendor);
router.post('/:orderId/verify-pickup', protect, verifyOrderPickup);

// Initiate Payment
router.post('/:orderId/pay', protect, initiatePayment);

// Confirm Payment (Webhook)
router.post('/webhooks/stripe', confirmPayment);

// Get orders by status for vendors or superAdmin
router.get('/vendor/:storeId/status/:status', protect, authorizeRoles('vendor', 'superAdmin'), getOrdersByStatus);

export default router;
