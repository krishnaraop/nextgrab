// src/controllers/surpriseBagController.js
import SurpriseBag from '../models/SurpriseBag.js';
import Store from '../models/Store.js';
import { notifyWaitlistUsers } from './waitlistController.js'; 
import mongoose from 'mongoose';


// Create Surprise Bag
export const createSurpriseBag = async (req, res) => {
  const { name, description, price, category, quantity, storeId, pickupSchedule } = req.body;

  try {
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const surpriseBag = await SurpriseBag.create({
      name,
      description,
      price,
      category,
      store: storeId,
      quantity,
      pickupSchedule,
    });

    res.status(201).json({ message: 'Surprise bag created successfully', surpriseBag });
  } catch (error) {
    console.error(`Error creating surprise bag: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Surprise Bag
export const updateSurpriseBag = async (req, res) => {
  const { bagId } = req.params;
  const updateData = req.body;

  try {
    const surpriseBag = await SurpriseBag.findByIdAndUpdate(bagId, updateData, { new: true });
    if (!surpriseBag) {
      return res.status(404).json({ message: 'Surprise bag not found' });
    }

    res.status(200).json({ message: 'Surprise bag updated successfully', surpriseBag });
  } catch (error) {
    console.error(`Error updating surprise bag: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Surprise Bag
export const deleteSurpriseBag = async (req, res) => {
  const { bagId } = req.params;

  try {
    const surpriseBag = await SurpriseBag.findByIdAndDelete(bagId);
    if (!surpriseBag) {
      return res.status(404).json({ message: 'Surprise bag not found' });
    }

    res.status(200).json({ message: 'Surprise bag deleted successfully' });
  } catch (error) {
    console.error(`Error deleting surprise bag: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Surprise Bags for Store
export const getAllSurpriseBags = async (req, res) => {
  const { storeId } = req.params;

  try {
    const surpriseBags = await SurpriseBag.find({ store: storeId, available: true });
    if (!surpriseBags.length) {
      return res.status(404).json({ message: 'No surprise bags found for this store' });
    }

    res.status(200).json({ surpriseBags });
  } catch (error) {
    console.error(`Error retrieving surprise bags: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};


// Update Surprise Bag Quantity
export const updateSurpriseBagQuantity = async (req, res) => {
  const { surpriseBagId } = req.params;
  const { quantity } = req.body;

  try {
    // Validate `surpriseBagId` to ensure it's a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(surpriseBagId)) {
      return res.status(400).json({ message: 'Invalid surprise bag ID' });
    }

    // Find the surprise bag by its ID
    const surpriseBag = await SurpriseBag.findById(surpriseBagId);
    if (!surpriseBag) {
      return res.status(404).json({ message: 'Surprise bag not found' });
    }

    // Update the quantity and availability of the surprise bag
    surpriseBag.quantity = quantity;
    surpriseBag.available = quantity > 0;
    await surpriseBag.save();

    // Notify users on the waitlist if the surprise bag is now available
    if (surpriseBag.available) {
      await notifyWaitlistUsers(surpriseBagId);
    }

    res.status(200).json({ message: 'Surprise bag updated successfully', surpriseBag });
  } catch (error) {
    console.error(`Error updating surprise bag: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};



