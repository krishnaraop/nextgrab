// src/routes/surpriseBagRoutes.js
import { Router } from 'express';
import {
  createSurpriseBag,
  updateSurpriseBag,
  deleteSurpriseBag,
  getAllSurpriseBags,
  updateSurpriseBagQuantity
} from '../controllers/surpriseBagController.js';
import protect from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = Router();

// Create Surprise Bag
router.post('/', protect, authorizeRoles('vendor', 'superAdmin'), createSurpriseBag);

// Update Surprise Bag
router.put('/:bagId', protect, authorizeRoles('vendor', 'superAdmin'), updateSurpriseBag);

// Delete Surprise Bag
router.delete('/:bagId', protect, authorizeRoles('vendor', 'superAdmin'), deleteSurpriseBag);

// Get All Surprise Bags for a Store
router.get('/store/:storeId', getAllSurpriseBags);

// New route to update the quantity of a surprise bag
router.put('/:surpriseBagId/quantity', protect, authorizeRoles('vendor', 'superAdmin'), updateSurpriseBagQuantity);


export default router;
