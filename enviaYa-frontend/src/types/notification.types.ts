export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationType = 
  | 'ORDER_CREATED'
  | 'ORDER_CANCELLED'
  | 'ORDER_DELIVERED'
  | 'SHIPMENT_CREATED'
  | 'SHIPMENT_IN_TRANSIT'
  | 'SHIPMENT_DELIVERED'
  | 'SHIPMENT_LOST'
  | 'STOCK_LOW'
  | 'STOCK_OUT'
  | 'GENERAL';

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  message?: string;
}

export interface NotificationResponse {
  success: boolean;
  data: Notification;
  message?: string;
}
