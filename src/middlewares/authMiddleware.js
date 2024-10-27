import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();


const protect = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      console.log('No Authorization header found');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Extracted Token:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found for ID:', decoded.id);
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('User Details:', user);

    // Everything checks out, proceed to next middleware
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication Error:', error.message);
    res.status(401).json({ message: 'Please authenticate' });
  }
};




export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Log the decoded token
    console.log('Decoded Token:', decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Log user details to verify information
    console.log('User Details:', user);

    if (user.role !== 'vendor') {
      console.log('Access denied: User role is not vendor');
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!user.isVerified) {
      console.log('Access denied: Vendor is not verified');
      return res.status(403).json({ message: 'Access denied' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication Error:', error.message);
    res.status(401).json({ message: 'Please authenticate' });
  }
};






export const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email }, // Changed `id` to `_id`
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};


export default protect;


