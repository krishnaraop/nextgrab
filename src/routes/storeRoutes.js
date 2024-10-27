// src/routes/storeRoutes.js
import { Router } from 'express';
import axios from 'axios';
import Store from '../models/Store.js';  // Import the Store model
import {
  createStore,
  updateStore,
  deleteStore,
  getAllStores,
  getStoreDetails,
  getAllStoresByVendor,
  getStoreById,
  getNearbyStores, 
  getStoresByPlace
} from '../controllers/storeController.js';
import protect from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = Router();

// Create a store - only vendors and superAdmins are allowed
router.post('/', protect, authorizeRoles('vendor', 'superAdmin'), createStore);

// Get nearby stores - public route for finding stores near a location
router.get('/nearby', getNearbyStores);

// Geocode route - public route for getting stores based on a location name
router.get('/geocode', async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ message: 'Location is required' });
  }

  try {
    // Use Google Geocoding API to get the coordinates
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.GEOCODING_API_KEY}`;

    const response = await axios.get(geocodingUrl);
    const data = response.data;

    if (data.status !== 'OK' || !data.results.length) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const coordinates = data.results[0].geometry.location;
    const latitude = coordinates.lat;
    const longitude = coordinates.lng;

    console.log(`Geocoded coordinates for "${location}":`, latitude, longitude); // Logging coordinates

    // Use the nearby stores function to get the stores
    const nearbyStores = await Store.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 20000, // Increased to 20 km for more coverage
        },
      },
    });

    if (!nearbyStores.length) {
      console.log(`No stores found within 20 km of location "${location}"`);
      return res.status(404).json({ message: 'No stores found nearby' });
    }

    res.status(200).json({ stores: nearbyStores });
  } catch (error) {
    console.error(`Error fetching geocoded location: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get all stores - accessible to logged-in users
router.get('/', protect, getAllStores);

// Get store details by ID - accessible to logged-in users
router.get('/:storeId', protect, getStoreById);

// Get all stores by vendor - only vendors are allowed
router.get('/vendor/all', protect, authorizeRoles('vendor'), getAllStoresByVendor);

// Update a store by ID - only vendors and superAdmins are allowed
router.put('/:storeId', protect, authorizeRoles('vendor', 'superAdmin'), updateStore);

// Delete a store by ID - only vendors and superAdmins are allowed
router.delete('/:storeId', protect, authorizeRoles('vendor', 'superAdmin'), deleteStore);

// Get stores by place - public route (use a different controller function)
router.get('/location', getStoresByPlace);

export default router;
