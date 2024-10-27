// src/controllers/storeController.js
import Store from '../models/Store.js';
import Vendor from '../models/Vendor.js';
import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();




export const createStore = async (req, res) => {
  const { name, description, address, location } = req.body;

  try {
    // Explicitly convert req.user._id to ObjectId
    const vendorId = new mongoose.Types.ObjectId(req.user._id);

    // Find the vendor using the authenticated user's ID
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      console.log('Vendor not found for ID:', vendorId);
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Log vendor details for debugging
    console.log('Vendor:', vendor);

    // Check if the vendor is verified
    if (!vendor.isVerified) {
      console.log('Access denied: Vendor not verified');
      return res.status(403).json({ message: 'Access denied: Vendor not verified' });
    }

    // Check if vendor has multi-location enabled or no stores exist yet
    if (vendor.stores.length > 0 && !vendor.isMultiLocationEnabled) {
      console.log('Access denied: Multi-location not enabled for this vendor');
      return res.status(400).json({ message: 'Multi-location not enabled for this vendor' });
    }

    // Create the store with the authenticated vendor's ID
    const store = await Store.create({
      name,
      description,
      address,
      location,
      vendor: vendorId,
    });

    // Add store reference to vendor
    vendor.stores.push(store._id);
    await vendor.save();

    res.status(201).json({ message: 'Store created successfully', store });
  } catch (error) {
    console.error(`Error creating store: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};




// Update an existing store
export const updateStore = async (req, res) => {
  const { storeId } = req.params;
  console.log('Received Store ID:', storeId); // Log the received store ID

  try {
    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      console.error('Invalid Store ID Format');
      return res.status(400).json({ message: 'Invalid store ID format' });
    }

    const store = await Store.findById(storeId);
    if (!store) {
      console.error('Store not found in database');
      return res.status(404).json({ message: 'Store not found' });
    }

    // Log if the store is found
    console.log('Store found:', store);

    // Update store fields if found
    const { name, description, category, photo } = req.body;
    if (name) store.name = name;
    if (description) store.description = description;
    if (category) store.category = category;
    if (photo) store.photo = photo;

    await store.save();

    res.status(200).json({ message: 'Store updated successfully', store });
  } catch (error) {
    console.error(`Error updating store: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};


// Retrieve store details by storeId
export const getStoreDetails = async (req, res) => {
  const { storeId } = req.params;

  try {
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.status(200).json({ message: 'Store details retrieved successfully', store });
  } catch (error) {
    console.error(`Error retrieving store details: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};
  
  

// Delete a store
export const deleteStore = async (req, res) => {
  const { storeId } = req.params;

  try {
    const store = await Store.findByIdAndDelete(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Remove store reference from vendor
    await Vendor.findByIdAndUpdate(store.vendor, { $pull: { stores: store._id } });

    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error(`Error deleting store: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all stores
export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(200).json({ message: 'Stores retrieved successfully', stores });
  } catch (error) {
    console.error(`Error retrieving stores: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAllStoresByVendor = async (req, res) => {
  try {
    const vendorId = req.user._id;
    console.log('Vendor ID used for querying stores:', vendorId); // Log the vendor ID being used

    const stores = await Store.find({ vendor: vendorId });
    if (!stores || stores.length === 0) {
      console.log('No stores found for vendor with ID:', vendorId);
      return res.status(404).json({ message: 'No stores found for this vendor' });
    }

    res.status(200).json({ message: 'Stores retrieved successfully', stores });
  } catch (error) {
    console.error(`Error retrieving stores: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};






// Retrieve store details by storeId
export const getStoreById = async (req, res) => {
  const { storeId } = req.params;

  try {
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.status(200).json({ message: 'Store retrieved successfully', store });
  } catch (error) {
    console.error(`Error retrieving store: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get Nearby Stores
export const getNearbyStores = async (req, res) => {
  let { latitude, longitude, maxDistance } = req.query;

  console.log('getNearbyStores endpoint hit');
  console.log('Query parameters:', req.query);

  if (!latitude || !longitude) {
    console.log('Missing latitude or longitude');
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  latitude = parseFloat(latitude);
  longitude = parseFloat(longitude);
  maxDistance = parseInt(maxDistance) || 5000; // Default max distance of 5 km

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    console.log('Invalid latitude or longitude values');
    return res.status(400).json({ message: 'Invalid latitude or longitude values' });
  }

  console.log('Parsed coordinates:', latitude, longitude);
  console.log('Max distance:', maxDistance);

  try {
    const nearbyStores = await Store.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
        },
      },
    });

    console.log('Nearby stores found:', nearbyStores.length);
    if (!nearbyStores.length) {
      return res.status(404).json({ message: 'No stores found nearby' });
    }

    res.status(200).json({ stores: nearbyStores });
  } catch (error) {
    console.error(`Error fetching nearby stores: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};






export const getStoresByPlace = async (req, res) => {
  const { placeName } = req.query;

  if (!placeName) {
    return res.status(400).json({ message: 'Place name is required' });
  }

  try {
    // Call Geocoding API to get coordinates for the place name
    const apiKey = process.env.GEOCODING_API_KEY; // Your geocoding API key
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(placeName)}&key=${apiKey}`;

    const response = await axios.get(geocodingUrl);
    const data = response.data;

    if (data.status !== 'OK' || !data.results.length) {
      return res.status(404).json({ message: 'Place not found' });
    }

    const { lat, lng } = data.results[0].geometry.location;

    // Use the latitude and longitude to find nearby stores
    const nearbyStores = await Store.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: 5000, // Default max distance of 5 km
        },
      },
    });

    if (!nearbyStores.length) {
      return res.status(404).json({ message: 'No stores found nearby' });
    }

    res.status(200).json({ stores: nearbyStores });
  } catch (error) {
    console.error(`Error fetching stores by place: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};
