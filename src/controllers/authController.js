// src/controllers/authController.js
import User from '../models/User.js';
import Vendor from '../models/Vendor.js'; // Import the Vendor model
import jwt from 'jsonwebtoken';
import admin from '../config/firebase.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

export const registerVendor = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create hashed password
    const salt = await bcrypt.genSalt(10);  // Generate salt
    const hashedPassword = await bcrypt.hash(password, salt);  // Hash the password

    // Create user in Users collection
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'vendor',
      isVerified: false, // Initially not verified
    });

    // Create vendor in Vendors collection
    const vendor = await Vendor.create({
      name,
      email,
      phone,
      userId: user._id, // Reference to the user entry
      stores: [],
      isVerified: false,
    });

    res.status(201).json({ message: 'Vendor registered successfully', vendor });
  } catch (error) {
    console.error(`Error registering vendor: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};




// Example login function
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // For vendors, fetch vendor-specific information if needed
    if (user.role === 'vendor') {
      const vendor = await Vendor.findOne({ userId: user._id });
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
      return res.json({ token, vendor });
    }

    res.json({ token });
  } catch (error) {
    console.error(`Error logging in: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};



// Register user (Google or OTP based)
export const registerUser = async (req, res) => {
  const { name, email, phone, googleId } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = await User.create({ name, email, phone, googleId });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login with JWT token
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Password validation (if applicable)
    if (user.password && password !== user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP using Firebase Admin
export const verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(otp);
    if (decodedToken.phone_number === phone) {
      let user = await User.findOne({ phone });

      if (!user) {
        user = await User.create({ phone });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      res.status(200).json({ token, user });
    } else {
      res.status(400).json({ message: 'OTP verification failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
