import { SupplierRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/SupplierRepositoryMongo';
import { Supplier } from '../../../domain/suppliers/entities/Supplier';

export class CreateSupplierUseCase {
  private supplierRepository: SupplierRepositoryMongo;

  constructor() {
    this.supplierRepository = new SupplierRepositoryMongo();
  }

  async execute(supplierData: Supplier, userRole: string): Promise<Supplier> {
    if (!['ADMIN', 'VENDOR'].includes(userRole?.trim())) {
      throw new Error('Solo los administradores y vendedores pueden crear proveedores');
    }

    const existingSupplier = await this.supplierRepository.findByEmail(supplierData.email);
    if (existingSupplier) {
      throw new Error('Ya existe un proveedor con ese email');
    }

    if (!supplierData.name || supplierData.name.trim().length === 0) {
      throw new Error('El nombre del proveedor es requerido');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(supplierData.email)) {
      throw new Error('Email inválido');
    }

    // Validación más flexible del teléfono colombiano
    const phoneRegex = /^\+57\d{10}$/;
    if (supplierData.phone && !phoneRegex.test(supplierData.phone)) {
      throw new Error('Teléfono inválido. Formato esperado: +57 seguido de 10 dígitos (ej: +573001234567)');
    }

    return await this.supplierRepository.create(supplierData);
  }
}
