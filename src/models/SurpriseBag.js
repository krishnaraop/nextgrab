// src/models/SurpriseBag.js
import mongoose from 'mongoose';

const surpriseBagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['small', 'medium', 'large'],
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    pickupSchedule: {
      type: [
        {
          day: { type: String, required: true },
          timeSlots: { type: [String], required: true },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const SurpriseBag = mongoose.model('SurpriseBag', surpriseBagSchema);

export default SurpriseBag;
