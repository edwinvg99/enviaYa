// Entidad de dominio: Notification
export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  relatedEntityId: number | null;
  relatedEntityType: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationType = 
  | 'ORDER_STATUS'
  | 'SHIPMENT_UPDATE'
  | 'PROMOTION'
  | 'SYSTEM'
  | 'ALERT';
