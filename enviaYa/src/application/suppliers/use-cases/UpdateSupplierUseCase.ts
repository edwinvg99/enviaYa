import { SupplierRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/SupplierRepositoryMongo';
import { Supplier } from '../../../domain/suppliers/entities/Supplier';

export class UpdateSupplierUseCase {
  private supplierRepository: SupplierRepositoryMongo;

  constructor() {
    this.supplierRepository = new SupplierRepositoryMongo();
  }

  async execute(id: string, supplierData: Partial<Supplier>, userRole: string): Promise<Supplier | null> {
    if (!['ADMIN', 'VENDOR'].includes(userRole?.trim())) {
      throw new Error('Solo los administradores y vendedores pueden actualizar proveedores');
    }

    const existingSupplier = await this.supplierRepository.findById(id);
    if (!existingSupplier) {
      throw new Error('Proveedor no encontrado');
    }

    if (supplierData.email && supplierData.email !== existingSupplier.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(supplierData.email)) {
        throw new Error('Email inválido');
      }

      const duplicateEmail = await this.supplierRepository.findByEmail(supplierData.email);
      if (duplicateEmail) {
        throw new Error('Ya existe un proveedor con ese email');
      }
    }

    if (supplierData.phone) {
      const phoneRegex = /^\+57\d{10}$/;
      if (!phoneRegex.test(supplierData.phone)) {
        throw new Error('Teléfono inválido. Formato esperado: +57 seguido de 10 dígitos (ej: +573001234567)');
      }
    }

    if (supplierData.name !== undefined) {
      if (!supplierData.name || supplierData.name.trim().length === 0) {
        throw new Error('El nombre del proveedor no puede estar vacío');
      }
    }

    return await this.supplierRepository.update(id, supplierData);
  }
}
