import { ShipmentRepositoryMongo } from "../../../infrastructure/persistence/mongo/repositories/ShipmentRepositoryMongo";
import { NotificationRepositoryMongo } from "../../../infrastructure/persistence/mongo/repositories/NotificationRepositoryMongo";

export class MarkOverdueShipmentsAsLostUseCase {
  private shipmentRepository: ShipmentRepositoryMongo;
  private notificationRepository: NotificationRepositoryMongo;

  constructor() {
    this.shipmentRepository = new ShipmentRepositoryMongo();
    this.notificationRepository = new NotificationRepositoryMongo();
  }

  async execute(): Promise<number> {
    const overdueShipments =
      await this.shipmentRepository.findOverdueShipments();

    let processedCount = 0;

    for (const shipment of overdueShipments) {
      await this.shipmentRepository.update(shipment._id!, {
        status: "PERDIDO",
        currentLocation: "Estado desconocido",
      });

      await this.shipmentRepository.addHistoryEntry(shipment._id!, {
        status: "PERDIDO",
        location: "Estado desconocido",
        description:
          "Envío marcado como perdido después de 15 días sin entrega",
        timestamp: new Date(),
      });

      await this.notificationRepository.create({
        userId: shipment.userId,
        title: "Envío Perdido",
        message: `Su envío ${shipment.trackingNumber} ha sido marcado como perdido después de 15 días sin entrega. Por favor contacte con soporte.`,
        type: "SHIPMENT_UPDATE",
        isRead: false,
      });

      processedCount++;
    }

    return processedCount;
  }
}
