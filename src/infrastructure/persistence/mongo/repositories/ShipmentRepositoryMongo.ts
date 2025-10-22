import { Shipment } from "../../../../domain/shipments/entities/Shipment";
import { ShipmentModel } from "../../data/models/ShipmentModel";

export class ShipmentRepositoryMongo {
  async findAll(filters: any, page: number, limit: number): Promise<Shipment[]> {
    try {
      const query: any = {};
      
      if (filters.status) query.status = filters.status;
      if (filters.userId) query.userId = filters.userId;
      if (filters.carrier) query.carrier = filters.carrier;

      const skip = (page - 1) * limit;
      const shipments = await ShipmentModel.find(query)
        .populate('userId', 'name email')
        .populate('orderId', 'orderNumber')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      return shipments.map(s => s.toObject() as Shipment);
    } catch (error) {
      console.error('Error al buscar envíos:', error);
      throw new Error('Error al buscar envíos');
    }
  }

  async findById(id: string): Promise<Shipment | null> {
    try {
      const shipment = await ShipmentModel.findById(id)
        .populate('userId', 'name email')
        .populate('orderId', 'orderNumber');
      return shipment ? shipment.toObject() as Shipment : null;
    } catch (error) {
      console.error('Error al buscar envío por ID:', error);
      throw new Error('Error al buscar el envío');
    }
  }

  async create(shipmentData: Shipment): Promise<Shipment> {
    try {
      const shipment = new ShipmentModel(shipmentData);
      const savedShipment = await shipment.save();
      return savedShipment.toObject() as Shipment;
    } catch (error) {
      console.error('Error al crear envío:', error);
      throw new Error('No se pudo crear el envío');
    }
  }

  async update(id: string, shipmentData: Partial<Shipment>): Promise<Shipment | null> {
    try {
      const updatedShipment = await ShipmentModel.findByIdAndUpdate(
        id, 
        shipmentData, 
        { new: true, runValidators: true }
      ).populate('userId', 'name email')
       .populate('orderId', 'orderNumber');
      return updatedShipment ? updatedShipment.toObject() as Shipment : null;
    } catch (error) {
      console.error('Error al actualizar envío:', error);
      throw new Error('No se pudo actualizar el envío');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await ShipmentModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error al eliminar envío:', error);
      throw new Error('No se pudo eliminar el envío');
    }
  }

  async findByTrackingNumber(trackingNumber: string): Promise<Shipment | null> {
    try {
      const shipment = await ShipmentModel.findOne({ trackingNumber })
        .populate('userId', 'name email')
        .populate('orderId', 'orderNumber');
      return shipment ? shipment.toObject() as Shipment : null;
    } catch (error) {
      console.error('Error al buscar envío por número de tracking:', error);
      throw new Error('Error al buscar el envío');
    }
  }

  async findByOrderId(orderId: string): Promise<Shipment | null> {
    try {
      const shipment = await ShipmentModel.findOne({ orderId })
        .populate('userId', 'name email')
        .populate('orderId', 'orderNumber');
      return shipment ? shipment.toObject() as Shipment : null;
    } catch (error) {
      console.error('Error al buscar envío por orden:', error);
      throw new Error('Error al buscar el envío');
    }
  }

  async findByUserId(userId: string): Promise<Shipment[]> {
    try {
      const shipments = await ShipmentModel.find({ userId })
        .populate('orderId', 'orderNumber')
        .sort({ createdAt: -1 });
      return shipments.map(s => s.toObject() as Shipment);
    } catch (error) {
      console.error('Error al buscar envíos por usuario:', error);
      throw new Error('Error al buscar envíos del usuario');
    }
  }

  async findByStatus(status: string): Promise<Shipment[]> {
    try {
      const shipments = await ShipmentModel.find({ status })
        .populate('userId', 'name email')
        .populate('orderId', 'orderNumber')
        .sort({ createdAt: -1 });
      return shipments.map(s => s.toObject() as Shipment);
    } catch (error) {
      console.error('Error al buscar envíos por estado:', error);
      throw new Error('Error al buscar envíos por estado');
    }
  }

  async findByCarrierTrackingNumber(carrierTrackingNumber: string): Promise<Shipment | null> {
    try {
      const shipment = await ShipmentModel.findOne({ carrierTrackingNumber })
        .populate('userId', 'name email')
        .populate('orderId', 'orderNumber');
      return shipment ? shipment.toObject() as Shipment : null;
    } catch (error) {
      console.error('Error al buscar envío por número de transportadora:', error);
      throw new Error('Error al buscar el envío');
    }
  }

  async addHistoryEntry(shipmentId: string, historyEntry: any): Promise<Shipment | null> {
    try {
      const shipment = await ShipmentModel.findById(shipmentId);
      if (!shipment) return null;

      shipment.history.push(historyEntry);
      await shipment.save();
      
      return shipment.toObject() as Shipment;
    } catch (error) {
      console.error('Error al agregar entrada de historial:', error);
      throw new Error('Error al agregar entrada de historial');
    }
  }

  async findOverdueShipments(): Promise<Shipment[]> {
    try {
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

      const shipments = await ShipmentModel.find({
        status: { $nin: ['ENTREGADO', 'CANCELADO', 'PERDIDO'] },
        createdAt: { $lt: fifteenDaysAgo }
      }).populate('userId', 'name email')
        .populate('orderId', 'orderNumber');

      return shipments.map(s => s.toObject() as Shipment);
    } catch (error) {
      console.error('Error al buscar envíos vencidos:', error);
      throw new Error('Error al buscar envíos vencidos');
    }
  }
}
