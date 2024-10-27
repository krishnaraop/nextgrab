// src/models/Store.js
import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    isMultiLocationEnabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

storeSchema.index({ location: '2dsphere' });

const Store = mongoose.model('Store', storeSchema);

export default Store;
