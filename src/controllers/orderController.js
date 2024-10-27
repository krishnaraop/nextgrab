import Order from '../models/Order.js';
import SurpriseBag from '../models/SurpriseBag.js';
import Store from '../models/Store.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initiate Payment
export const initiatePayment = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.totalPrice * 100, // Amount in cents
      currency: 'usd',
      metadata: { orderId: order._id.toString() },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.error(`Error initiating payment: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Confirm Payment (Webhook)
export const confirmPayment = async (req, res) => {
  let event;

  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      // Find and update the order
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'completed';
        await order.save();
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error(`Error confirming payment: ${error.message}`);
    res.status(400).json({ message: 'Webhook Error' });
  }
};


export const placeOrder = async (req, res) => {
  const { storeId, surpriseBagId, quantity, pickupTime, promoCode } = req.body;

  try {
    const surpriseBag = await SurpriseBag.findById(surpriseBagId);
    if (!surpriseBag) {
      return res.status(404).json({ message: 'Surprise bag not found' });
    }

    if (!surpriseBag.available || surpriseBag.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity available' });
    }

    let discount = 0;
    if (promoCode) {
      const appliedPromoCode = await PromoCode.findOne({ code: promoCode });

      if (appliedPromoCode && appliedPromoCode.expirationDate >= new Date() && appliedPromoCode.currentUsage < appliedPromoCode.maxUsage) {
        discount = (appliedPromoCode.discountPercentage / 100) * (surpriseBag.price * quantity);
        appliedPromoCode.currentUsage += 1;
        await appliedPromoCode.save();
      } else {
        return res.status(400).json({ message: 'Invalid or expired promo code' });
      }
    }

    const totalPrice = (surpriseBag.price * quantity) - discount;

    const order = await Order.create({
      user: req.user._id,
      store: storeId,
      surpriseBag: surpriseBagId,
      quantity,
      totalPrice,
      discount,
      pickupTime,
    });

    // Update surprise bag quantity
    surpriseBag.quantity -= quantity;
    surpriseBag.available = surpriseBag.quantity > 0;
    await surpriseBag.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error(`Error placing order: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get Orders for User
export const getOrdersForUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('surpriseBag store');
    res.status(200).json({ orders });
  } catch (error) {
    console.error(`Error fetching orders for user: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Orders for Vendor (for a specific store)
export const getOrdersForVendor = async (req, res) => {
  const { storeId } = req.params;

  try {
    const orders = await Order.find({ store: storeId }).populate('user surpriseBag');
    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this store' });
    }
    res.status(200).json({ orders });
  } catch (error) {
    console.error(`Error fetching orders for vendor: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  // Validate status
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error(`Error updating order status: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};


// Verify Order Pickup
export const verifyOrderPickup = async (req, res) => {
  const { orderId } = req.params;
  const { pickupCode } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.pickupCode !== pickupCode) {
      return res.status(400).json({ message: 'Invalid pickup code' });
    }

    order.status = 'completed';
    await order.save();

    res.status(200).json({ message: 'Order pickup verified successfully', order });
  } catch (error) {
    console.error(`Error verifying order pickup: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getOrdersByStatus = async (req, res) => {
  const { storeId, status } = req.params;

  try {
    const orders = await Order.find({ store: storeId, status });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found with the given status' });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error(`Error fetching orders by status: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};
