// Puerto (Interface) del repositorio de envíos
import { Shipment, ShipmentStatus } from '../entities/Shipment';

export interface IShipmentRepository {
  findAll(): Promise<Shipment[]>;
  findById(id: number): Promise<Shipment | null>;
  findByTrackingNumber(trackingNumber: string): Promise<Shipment | null>;
  findByUserId(userId: number): Promise<Shipment[]>;
  findByOrderId(orderId: number): Promise<Shipment | null>;
  create(shipment: Omit<Shipment, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt'>): Promise<Shipment>;
  update(id: number, shipment: Partial<Shipment>): Promise<Shipment | null>;
  updateStatus(id: number, status: ShipmentStatus, location: string, description: string): Promise<Shipment | null>;
  delete(id: number): Promise<boolean>;
}
