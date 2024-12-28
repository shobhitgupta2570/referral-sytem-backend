import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Notification } from '../models/notification.model.js';

const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

  res.status(200).json(notifications);
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findById(id);
  if (!notification) throw new ApiError(404, 'Notification not found');

  notification.isRead = true;
  await notification.save();

  res.status(200).json(notification._id);
});

export { getNotifications, markNotificationAsRead };
