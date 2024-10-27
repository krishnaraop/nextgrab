// src/routes/authRoutes.js
import { Router } from 'express';
import { registerUser, loginUser, verifyOTP, registerVendor, login } from '../controllers/authController.js'; // Import all necessary functions

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);

// Vendor-specific routes
router.post('/register/vendor', registerVendor);
router.post('/login/vendor', login); // Update route path for vendor login if it's specifically for vendors

export default router;
