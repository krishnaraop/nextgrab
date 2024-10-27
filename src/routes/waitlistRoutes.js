import express from 'express';
import { addToWaitlist, getWaitlistForSurpriseBag } from '../controllers/waitlistController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

// Add to waitlist (User authentication)
router.post('/', protect, addToWaitlist);

// Get waitlist for a surprise bag (Vendor authentication)
router.get('/:surpriseBagId', protect, getWaitlistForSurpriseBag);

export default router;
