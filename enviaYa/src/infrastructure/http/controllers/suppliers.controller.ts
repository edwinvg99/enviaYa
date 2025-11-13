import { Request, Response } from 'express';
import { SupplierRepositoryMongo } from '../../persistence/mongo/repositories/SupplierRepositoryMongo';
import { CreateSupplierUseCase } from '../../../application/suppliers/use-cases/CreateSupplierUseCase';
import { UpdateSupplierUseCase } from '../../../application/suppliers/use-cases/UpdateSupplierUseCase';
import { DeleteSupplierUseCase } from '../../../application/suppliers/use-cases/DeleteSupplierUseCase';
import { successResponse, errorResponse } from '../../../shared/utils/responses';

export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const supplierRepository = new SupplierRepositoryMongo();
    const suppliers = await supplierRepository.findAll();
    
    res.json(successResponse(200, 'Proveedores obtenidos exitosamente', suppliers));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener proveedores', error));
  }
};

export const getSupplierById = async (req: Request, res: Response) => {
  try {
    const supplierRepository = new SupplierRepositoryMongo();
    const supplier = await supplierRepository.findById(req.params.id);
    
    if (!supplier) {
      return res.status(404).json(errorResponse(404, 'Proveedor no encontrado'));
    }
    
    res.json(successResponse(200, 'Proveedor obtenido exitosamente', supplier));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener proveedor', error));
  }
};

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const createSupplierUseCase = new CreateSupplierUseCase();
    const userRole = req.user!.role;
    
    console.log('Datos recibidos en createSupplier:', JSON.stringify(req.body, null, 2));
    console.log('User role:', userRole);
    
    const supplier = await createSupplierUseCase.execute(req.body, userRole);
    
    res.status(201).json(successResponse(201, 'Proveedor creado exitosamente', supplier));
  } catch (error) {
    console.error('Error en createSupplier:', error);
    const message = error instanceof Error ? error.message : 'Error al crear proveedor';
    res.status(400).json(errorResponse(400, message, error));
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const updateSupplierUseCase = new UpdateSupplierUseCase();
    const userRole = req.user!.role;
    
    const supplier = await updateSupplierUseCase.execute(req.params.id, req.body, userRole);
    
    if (!supplier) {
      return res.status(404).json(errorResponse(404, 'Proveedor no encontrado'));
    }
    
    res.json(successResponse(200, 'Proveedor actualizado exitosamente', supplier));
  } catch (error) {
    res.status(400).json(errorResponse(400, 'Error al actualizar proveedor', error));
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const deleteSupplierUseCase = new DeleteSupplierUseCase();
    const userRole = req.user!.role;
    
    const deleted = await deleteSupplierUseCase.execute(req.params.id, userRole);
    
    if (!deleted) {
      return res.status(404).json(errorResponse(404, 'Proveedor no encontrado'));
    }
    
    res.json(successResponse(200, 'Proveedor eliminado exitosamente'));
  } catch (error) {
    res.status(400).json(errorResponse(400, 'Error al eliminar proveedor', error));
  }
};
