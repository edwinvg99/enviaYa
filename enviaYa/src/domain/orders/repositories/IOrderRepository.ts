// Puerto (Interface) del repositorio de órdenes
import { Order, OrderStatus } from '../entities/Order';

export interface IOrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: number): Promise<Order | null>;
  findByUserId(userId: number): Promise<Order[]>;
  findByOrderNumber(orderNumber: string): Promise<Order | null>;
  create(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order>;
  update(id: number, order: Partial<Order>): Promise<Order | null>;
  updateStatus(id: number, status: OrderStatus): Promise<Order | null>;
  delete(id: number): Promise<boolean>;
}
