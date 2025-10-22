import mongoose, { Schema, Document } from 'mongoose';
import { Notification } from '../../../../domain/notifications/entities/Notification';

export interface INotificationModel extends Omit<Notification, '_id'>, Document {}

const NotificationSchema = new Schema<INotificationModel>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['ORDER_STATUS', 'ORDER_CANCELLED', 'SHIPMENT_UPDATE', 'PROMOTION', 'SYSTEM', 'ALERT'],
    required: true
  },
  isRead: { type: Boolean, default: false },
  relatedEntityId: { type: String, default: null },
  relatedEntityType: { type: String, default: null }
}, {
  timestamps: true
});

export const NotificationModel = mongoose.model<INotificationModel>('Notification', NotificationSchema);
