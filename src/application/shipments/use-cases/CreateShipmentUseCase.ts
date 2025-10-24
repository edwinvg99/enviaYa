import { ShipmentRepositoryMongo } from "../../../infrastructure/persistence/mongo/repositories/ShipmentRepositoryMongo";
import { OrderRepositoryMongo } from "../../../infrastructure/persistence/mongo/repositories/OrderRepositoryMongo";
import { Shipment } from "../../../domain/shipments/entities/Shipment";

export class CreateShipmentUseCase {
  private shipmentRepository: ShipmentRepositoryMongo;
  private orderRepository: OrderRepositoryMongo;

  constructor() {
    this.shipmentRepository = new ShipmentRepositoryMongo();
    this.orderRepository = new OrderRepositoryMongo();
  }

  async execute(orderId: string): Promise<Shipment> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error("Orden no encontrada");
    }

    if (order.status !== "PREPARANDO") {
      throw new Error(
        "La orden debe estar en estado PREPARANDO para crear el envío"
      );
    }

    const existingShipment =
      await this.shipmentRepository.findByOrderId(orderId);
    if (existingShipment) {
      throw new Error("Ya existe un envío para esta orden");
    }

    const trackingNumber = this.generateTrackingNumber();

    const shipmentData: Shipment = {
      orderId,
      userId: order.userId,
      trackingNumber,
      status: "PENDIENTE",
      currentLocation: "Centro de distribución",
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 días
      history: [
        {
          status: "PENDIENTE",
          location: "Centro de distribución",
          description: "Envío creado, esperando procesamiento",
          timestamp: new Date(),
        },
      ],
      carrier: "EnviaYa",
      shippingAddress: order.shippingAddress,
    };

    const shipment = await this.shipmentRepository.create(shipmentData);

    await this.orderRepository.update(orderId, { status: "EN_TRANSITO" });

    return shipment;
  }

  private generateTrackingNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0");
    return `TRK-${year}${month}${day}-${random}`;
  }
}
