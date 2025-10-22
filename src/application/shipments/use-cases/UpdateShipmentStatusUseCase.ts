import { ShipmentRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/ShipmentRepositoryMongo';
import { NotificationRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/NotificationRepositoryMongo';
import { ShipmentStatus } from '../../../domain/shipments/entities/Shipment';

export class UpdateShipmentStatusUseCase {
  private shipmentRepository: ShipmentRepositoryMongo;
  private notificationRepository: NotificationRepositoryMongo;

  constructor() {
    this.shipmentRepository = new ShipmentRepositoryMongo();
    this.notificationRepository = new NotificationRepositoryMongo();
  }

  async execute(
    shipmentId: string, 
    newStatus: ShipmentStatus, 
    location: string, 
    description: string,
    userRole: string,
    carrierTrackingNumber?: string
  ): Promise<any> {
    // Solo administradores y vendedores pueden actualizar estados
    if (!['ADMIN', 'VENDOR'].includes(userRole)) {
      throw new Error('Solo administradores y vendedores pueden actualizar estados de envío');
    }

    const shipment = await this.shipmentRepository.findById(shipmentId);
    if (!shipment) {
      throw new Error('Envío no encontrado');
    }

    // Validar transición de estado secuencial
    if (!this.isValidStatusTransition(shipment.status, newStatus)) {
      throw new Error(`No se puede cambiar de ${shipment.status} a ${newStatus}`);
    }

    // Validar número de guía único si se proporciona
    if (carrierTrackingNumber) {
      const existingShipment = await this.shipmentRepository.findByCarrierTrackingNumber(carrierTrackingNumber);
      if (existingShipment && existingShipment._id !== shipmentId) {
        throw new Error('El número de guía de transportadora debe ser único');
      }
    }

    // Actualizar estado del envío
    const updateData: any = {
      status: newStatus,
      currentLocation: location
    };

    if (carrierTrackingNumber) {
      updateData.carrierTrackingNumber = carrierTrackingNumber;
    }

    if (newStatus === 'ENTREGADO') {
      updateData.actualDelivery = new Date();
    }

    const updatedShipment = await this.shipmentRepository.update(shipmentId, updateData);

    // Agregar entrada al historial
    await this.shipmentRepository.addHistoryEntry(shipmentId, {
      status: newStatus,
      location,
      description,
      timestamp: new Date()
    });

    // Crear notificación al usuario
    await this.notificationRepository.create({
      userId: shipment.userId,
      title: 'Actualización de Envío',
      message: `Su envío ${shipment.trackingNumber} ha cambiado a estado: ${newStatus}. ${description}`,
      type: 'SHIPMENT_UPDATE',
      isRead: false
    });

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
}
