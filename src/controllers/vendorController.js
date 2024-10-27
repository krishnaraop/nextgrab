// src/controllers/vendorController.js
import Vendor from '../models/Vendor.js';
import User from '../models/User.js';


// Create a new vendor
export const createVendor = async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    let vendor = await Vendor.findOne({ email });
    if (vendor) {
      return res.status(400).json({ message: 'Vendor already exists' });
    }

    vendor = await Vendor.create({ name, email, phone });

    res.status(201).json({ message: 'Vendor created successfully', vendor });
  } catch (error) {
    console.error(`Error creating vendor: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};



// Verify a vendor
export const verifyVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    vendor.isVerified = true;
    await vendor.save();

    res.status(200).json({ message: 'Vendor verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
