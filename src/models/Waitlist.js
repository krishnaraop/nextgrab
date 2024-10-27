import mongoose from 'mongoose';

const waitlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    surpriseBag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SurpriseBag',
      required: true,
    },
    status: {
      type: String,
      enum: ['waiting', 'notified'],
      default: 'waiting',
    },
  },
  { timestamps: true }
);

const Waitlist = mongoose.model('Waitlist', waitlistSchema);

export default Waitlist;
