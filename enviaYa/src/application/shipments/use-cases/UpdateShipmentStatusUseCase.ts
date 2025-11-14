import { ShipmentRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/ShipmentRepositoryMongo';
import { NotificationRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/NotificationRepositoryMongo';
import { OrderRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/OrderRepositoryMongo';
import { ShipmentStatus } from '../../../domain/shipments/entities/Shipment';

export class UpdateShipmentStatusUseCase {
  private shipmentRepository: ShipmentRepositoryMongo;
  private notificationRepository: NotificationRepositoryMongo;
  private orderRepository: OrderRepositoryMongo;

  constructor() {
    this.shipmentRepository = new ShipmentRepositoryMongo();
    this.notificationRepository = new NotificationRepositoryMongo();
    this.orderRepository = new OrderRepositoryMongo();
  }

  async execute(
    shipmentId: string, 
    newStatus: ShipmentStatus, 
    location: string, 
    description: string,
    userRole: string,
    carrierTrackingNumber?: string,
    deliveryConfirmation?: {
      confirmedBy: 'CUSTOMER' | 'ADMIN';
      photoUrl?: string;
      signature?: string;
      notes?: string;
    }
  ): Promise<any> {
    if (!['ADMIN', 'VENDOR'].includes(userRole)) {
      throw new Error('Solo administradores y vendedores pueden actualizar estados de envío');
    }

    const shipment = await this.shipmentRepository.findById(shipmentId);
    if (!shipment) {
      throw new Error('Envío no encontrado');
    }

    if (!this.isValidStatusTransition(shipment.status, newStatus)) {
      throw new Error(`No se puede cambiar de ${shipment.status} a ${newStatus}`);
    }

    if (carrierTrackingNumber) {
      const existingShipment = await this.shipmentRepository.findByCarrierTrackingNumber(carrierTrackingNumber);
      if (existingShipment && existingShipment._id !== shipmentId) {
        throw new Error('El número de guía de transportadora debe ser único');
      }
    }

    // Validar confirmación de entrega para estado ENTREGADO
    if (newStatus === 'ENTREGADO') {
      if (!deliveryConfirmation) {
        throw new Error('Se requiere confirmación de entrega para marcar como ENTREGADO');
      }
      if (!deliveryConfirmation.photoUrl && !deliveryConfirmation.signature) {
        throw new Error('Se requiere al menos una foto o firma de entrega');
      }
    }

    const updateData: any = {
      status: newStatus,
      currentLocation: location
    };

    if (carrierTrackingNumber) {
      updateData.carrierTrackingNumber = carrierTrackingNumber;
    }

    if (newStatus === 'ENTREGADO') {
      updateData.actualDelivery = new Date();
      updateData.deliveryConfirmation = {
        ...deliveryConfirmation,
        confirmedAt: new Date()
      };
    }

    const updatedShipment = await this.shipmentRepository.update(shipmentId, updateData);

    await this.shipmentRepository.addHistoryEntry(shipmentId, {
      status: newStatus,
      location,
      description,
      timestamp: new Date()
    });

    await this.notificationRepository.create({
      userId: shipment.userId,
      title: 'Actualización de Envío',
      message: `Su envío ${shipment.trackingNumber} ha cambiado a estado: ${newStatus}. ${description}`,
      type: 'SHIPMENT_UPDATE',
      isRead: false
    });

    // Mantener orden y envío alineados: mapear estados de envío a estados de orden
    const orderStatus = this.mapShipmentStatusToOrderStatus(newStatus);
    if (orderStatus) {
      try {
        await this.orderRepository.update(shipment.orderId, { status: orderStatus });
      } catch (err) {
        // No bloquear la actualización del envío si falla la sincronización de la orden
      }
    }

    return updatedShipment;
  }

  private isValidStatusTransition(currentStatus: ShipmentStatus, newStatus: ShipmentStatus): boolean {
    const validTransitions: { [key in ShipmentStatus]: ShipmentStatus[] } = {
      'PENDIENTE': ['PREPARANDO', 'CANCELADO'],
      'PREPARANDO': ['EN_TRANSITO', 'CANCELADO'],
      'EN_TRANSITO': ['EN_ENTREGA', 'CANCELADO'],
      'EN_ENTREGA': ['ENTREGADO', 'DEVUELTO', 'CANCELADO'],
      'ENTREGADO': [],
      'DEVUELTO': ['EN_TRANSITO'],
      'CANCELADO': [],
      'PERDIDO': []
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  private mapShipmentStatusToOrderStatus(status: ShipmentStatus): 'PREPARANDO' | 'EN_TRANSITO' | 'EN_ENTREGA' | 'ENTREGADO' | 'CANCELADO' | null {
    switch (status) {
      case 'PENDIENTE':
        // El envío recién creado mantiene la orden en PREPARANDO
        return 'PREPARANDO';
      case 'PREPARANDO':
        return 'PREPARANDO';
      case 'EN_TRANSITO':
        return 'EN_TRANSITO';
      case 'EN_ENTREGA':
        return 'EN_ENTREGA';
      case 'ENTREGADO':
        return 'ENTREGADO';
      case 'CANCELADO':
        return 'CANCELADO';
      // Estados específicos de envío sin equivalente directo en orden
      case 'DEVUELTO':
      case 'PERDIDO':
      default:
        return null;
    }
  }
}
