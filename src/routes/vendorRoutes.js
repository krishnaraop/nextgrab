import { Router } from 'express';
import { createVendor, verifyVendor } from '../controllers/vendorController.js';
import protect from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = Router();

router.post('/', protect, authorizeRoles('superAdmin'), createVendor);
router.put('/:vendorId/verify', protect, authorizeRoles('superAdmin'), verifyVendor);

export default router;
