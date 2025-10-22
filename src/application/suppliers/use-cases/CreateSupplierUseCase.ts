import { SupplierRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/SupplierRepositoryMongo';
import { Supplier } from '../../../domain/suppliers/entities/Supplier';

export class CreateSupplierUseCase {
  private supplierRepository: SupplierRepositoryMongo;

  constructor() {
    this.supplierRepository = new SupplierRepositoryMongo();
  }

  async execute(supplierData: Supplier, userRole: string): Promise<Supplier> {
    // Solo administradores pueden crear proveedores
    if (userRole?.trim() !== 'ADMIN') {
      throw new Error('Solo los administradores pueden crear proveedores');
    }

    // Validar que el email no esté duplicado
    const existingSupplier = await this.supplierRepository.findByEmail(supplierData.email);
    if (existingSupplier) {
      throw new Error('Ya existe un proveedor con ese email');
    }

    // Validar que el nombre no esté vacío
    if (!supplierData.name || supplierData.name.trim().length === 0) {
      throw new Error('El nombre del proveedor es requerido');
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(supplierData.email)) {
      throw new Error('Email inválido');
    }

    // Validar teléfono (formato colombiano)
    const phoneRegex = /^\+57\d{10}$/;
    if (supplierData.phone && !phoneRegex.test(supplierData.phone)) {
      throw new Error('Teléfono inválido. Formato esperado: +57XXXXXXXXXX');
    }

    return await this.supplierRepository.create(supplierData);
  }
}
