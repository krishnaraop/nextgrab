// src/controllers/analyticsController.js
import Order from '../models/Order.js';
import SurpriseBag from '../models/SurpriseBag.js';
import Store from '../models/Store.js';
import Vendor from '../models/Vendor.js';

// Vendor Analytics
export const getVendorAnalytics = async (req, res) => {
  const { vendorId } = req.params;

  try {
    const vendor = await Vendor.findById(vendorId).populate('stores');
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Fetch all orders for the vendor
    const storeIds = vendor.stores.map(store => store._id);
    const orders = await Order.find({ store: { $in: storeIds } });

    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const totalOrders = orders.length;

    // Calculate best-performing surprise bags
    const surpriseBagSales = {};
    orders.forEach(order => {
      const bagId = order.surpriseBag.toString();
      if (!surpriseBagSales[bagId]) {
        surpriseBagSales[bagId] = 0;
      }
      surpriseBagSales[bagId] += order.quantity;
    });

    const bestPerformingBags = await SurpriseBag.find({ _id: { $in: Object.keys(surpriseBagSales) } })
      .sort((a, b) => surpriseBagSales[b._id] - surpriseBagSales[a._id])
      .limit(5);

    res.status(200).json({
      totalRevenue,
      totalOrders,
      bestPerformingBags,
    });
  } catch (error) {
    console.error(`Error fetching vendor analytics: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Store Analytics
export const getStoreAnalytics = async (req, res) => {
  const { storeId } = req.params;

  try {
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const orders = await Order.find({ store: storeId });

    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const totalOrders = orders.length;

    // Calculate performance of each surprise bag
    const surpriseBagPerformance = await SurpriseBag.find({ store: storeId });

    res.status(200).json({
      totalRevenue,
      totalOrders,
      surpriseBagPerformance,
    });
  } catch (error) {
    console.error(`Error fetching store analytics: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};
