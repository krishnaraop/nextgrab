// src/models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    surpriseBag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SurpriseBag',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1, // Default value set to 1
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    pickupCode: {
      type: String,
      default: function () {
        return Math.random().toString(36).substr(2, 8).toUpperCase(); // Random 8-character string
      },
    },
    pickupTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
