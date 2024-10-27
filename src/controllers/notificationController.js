// src/controllers/notificationController.js
import admin from '../config/firebase.js';




// Send a notification to a user
export const sendNotification = async ({ userId, title, body, type }) => {
  try {
    // Create a notification entry in the database
    const notification = await Notification.create({ user: userId, title, body, type });

    // Temporarily skipping actual FCM notification sending
    // In production, include the actual FCM integration here

    console.log(`Notification sent to user ${userId}: ${title} - ${body}`);
  } catch (error) {
    console.error(`Error sending notification: ${error.message}`);
  }
};



// Send a notification to a user
// export const sendNotification = async (req, res) => {
//   const { userId, title, body, type } = req.body;
//   try {
//     // Create a notification entry in the database
//     const notification = await Notification.create({ user: userId, title, body, type });

//     // Send the notification via Firebase Cloud Messaging
//     const message = {
//       notification: {
//         title,
//         body,
//       },
//       token: req.body.token, // User's device token to receive the notification
//     };

//     await admin.messaging().send(message);

//     res.status(200).json({ message: 'Notification sent successfully', notification });
//   } catch (error) {
//     console.error(`Error sending notification: ${error.message}`);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// Get notifications for a user
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id });
    res.status(200).json({ message: 'Notifications retrieved successfully', notifications });
  } catch (error) {
    console.error(`Error retrieving notifications: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error(`Error marking notification as read: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};
