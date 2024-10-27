import Waitlist from '../models/Waitlist.js';
import SurpriseBag from '../models/SurpriseBag.js';
import User from '../models/User.js';

// Add User to Waitlist
export const addToWaitlist = async (req, res) => {
  const { surpriseBagId } = req.body;

  try {
    const surpriseBag = await SurpriseBag.findById(surpriseBagId);
    if (!surpriseBag) {
      return res.status(404).json({ message: 'Surprise bag not found' });
    }

    if (surpriseBag.available) {
      return res.status(400).json({ message: 'Surprise bag is available. No need to waitlist.' });
    }

    const existingWaitlist = await Waitlist.findOne({ user: req.user._id, surpriseBag: surpriseBagId });
    if (existingWaitlist) {
      return res.status(400).json({ message: 'You are already on the waitlist for this surprise bag.' });
    }

    const waitlistEntry = await Waitlist.create({
      user: req.user._id,
      surpriseBag: surpriseBagId,
    });

    res.status(201).json({ message: 'Added to waitlist successfully', waitlistEntry });
  } catch (error) {
    console.error(`Error adding to waitlist: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Waitlist for a Vendor's Surprise Bag
export const getWaitlistForSurpriseBag = async (req, res) => {
  const { surpriseBagId } = req.params;

  try {
    const waitlist = await Waitlist.find({ surpriseBag: surpriseBagId }).populate('user', 'name email');
    res.status(200).json({ waitlist });
  } catch (error) {
    console.error(`Error fetching waitlist: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// src/controllers/waitlistController.js

export const notifyWaitlistUsers = async (surpriseBagId) => {
  try {
    const waitlistUsers = await Waitlist.find({ surpriseBag: surpriseBagId, status: 'waiting' });

    for (const user of waitlistUsers) {
      // Send notification to user
      await sendNotification({
        userId: user.user,
        title: 'Surprise Bag Available',
        body: 'A surprise bag you are waiting for is now available. Grab it before it’s gone!',
        type: 'surpriseBagAvailable',
      });

      // Update the user's waitlist status to 'notified'
      user.status = 'notified';
      await user.save();
    }
  } catch (error) {
    console.error(`Error notifying waitlist users: ${error.message}`);
  }
};


