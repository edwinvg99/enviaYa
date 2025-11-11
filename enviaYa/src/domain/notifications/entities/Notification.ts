// Entidad de dominio: Notification
export interface Notification {
  _id?: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedEntityId?: string | null;
  relatedEntityType?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type NotificationType = 
  | 'ORDER_STATUS'
  | 'ORDER_CANCELLED'
  | 'SHIPMENT_UPDATE'
  | 'PROMOTION'
  | 'SYSTEM'
  | 'ALERT';
