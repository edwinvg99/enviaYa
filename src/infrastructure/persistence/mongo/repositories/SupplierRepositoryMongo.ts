import { Supplier } from "../../../../domain/suppliers/entities/Supplier";
import { SupplierModel } from "../../data/models/SupplierModel";

export class SupplierRepositoryMongo {
  async findAll(): Promise<Supplier[]> {
    try {
      const suppliers = await SupplierModel.find({ isActive: true });
      return suppliers.map(s => s.toObject() as Supplier);
    } catch (error) {
      console.error('Error al buscar proveedores:', error);
      throw new Error('Error al buscar proveedores');
    }
  }

  async findById(id: string): Promise<Supplier | null> {
    try {
      const supplier = await SupplierModel.findById(id);
      return supplier ? supplier.toObject() as Supplier : null;
    } catch (error) {
      console.error('Error al buscar proveedor por ID:', error);
      throw new Error('Error al buscar el proveedor');
    }
  }

  async create(supplierData: Supplier): Promise<Supplier> {
    try {
      const supplier = new SupplierModel(supplierData);
      const savedSupplier = await supplier.save();
      return savedSupplier.toObject() as Supplier;
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      throw new Error('No se pudo crear el proveedor');
    }
  }

  async update(id: string, supplierData: Partial<Supplier>): Promise<Supplier | null> {
    try {
      const updatedSupplier = await SupplierModel.findByIdAndUpdate(
        id, 
        supplierData, 
        { new: true, runValidators: true }
      );
      return updatedSupplier ? updatedSupplier.toObject() as Supplier : null;
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      throw new Error('No se pudo actualizar el proveedor');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await SupplierModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      throw new Error('No se pudo eliminar el proveedor');
    }
  }

  async findByEmail(email: string): Promise<Supplier | null> {
    try {
      const supplier = await SupplierModel.findOne({ email });
      return supplier ? supplier.toObject() as Supplier : null;
    } catch (error) {
      console.error('Error al buscar proveedor por email:', error);
      throw new Error('Error al buscar el proveedor');
    }
  }
}
