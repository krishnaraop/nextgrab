// src/models/Vendor.js
import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    stores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['vendor', 'storeAdmin'],
      default: 'vendor',
    },
  },
  { timestamps: true }
);

const Vendor = mongoose.model('Vendor', vendorSchema);

export default Vendor;
