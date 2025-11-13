import { Request, Response } from 'express';
import { ProductRepositoryMongo } from '../../persistence/mongo/repositories/ProductRepositoryMongo';
import { CreateProductUseCase } from '../../../application/products/use-cases/CreateProductUseCase';
import { UpdateProductUseCase } from '../../../application/products/use-cases/UpdateProductUseCase';
import { DeleteProductUseCase } from '../../../application/products/use-cases/DeleteProductUseCase';
import { UpdateStockUseCase } from '../../../application/products/use-cases/UpdateStockUseCase';
import { successResponse, errorResponse } from '../../../shared/utils/responses';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const productRepository = new ProductRepositoryMongo();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filters = req.query;

    const products = await productRepository.findAll(filters, page, limit);
    
    res.json(successResponse(200, 'Productos obtenidos exitosamente', products));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener productos', error));
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productRepository = new ProductRepositoryMongo();
    const product = await productRepository.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json(errorResponse(404, 'Producto no encontrado'));
    }
    
    res.json(successResponse(200, 'Producto obtenido exitosamente', product));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener producto', error));
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const createProductUseCase = new CreateProductUseCase();
    const userRole = req.user!.role; // Ya viene validado por el middleware
    
    const product = await createProductUseCase.execute(req.body, userRole);
    
    res.status(201).json(successResponse(201, 'Producto creado exitosamente', product));
  } catch (error) {
    res.status(400).json(errorResponse(400, 'Error al crear producto', error));
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updateProductUseCase = new UpdateProductUseCase();
    const userRole = req.user!.role;
    
    const product = await updateProductUseCase.execute(req.params.id, req.body, userRole);
    
    if (!product) {
      return res.status(404).json(errorResponse(404, 'Producto no encontrado'));
    }
    
    res.json(successResponse(200, 'Producto actualizado exitosamente', product));
  } catch (error) {
    res.status(400).json(errorResponse(400, 'Error al actualizar producto', error));
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deleteProductUseCase = new DeleteProductUseCase();
    const userRole = req.user!.role;
    
    const deleted = await deleteProductUseCase.execute(req.params.id, userRole);
    
    if (!deleted) {
      return res.status(404).json(errorResponse(404, 'Producto no encontrado'));
    }
    
    res.json(successResponse(200, 'Producto eliminado exitosamente'));
  } catch (error) {
    res.status(400).json(errorResponse(400, 'Error al eliminar producto', error));
  }
};

export const updateStock = async (req: Request, res: Response) => {
  try {
    const updateStockUseCase = new UpdateStockUseCase();
    const userRole = req.user!.role;
    const { quantity } = req.body;
    
    if (typeof quantity !== 'number') {
      return res.status(400).json(errorResponse(400, 'La cantidad debe ser un número'));
    }
    
    const product = await updateStockUseCase.execute(req.params.id, quantity, userRole);
    
    res.json(successResponse(200, 'Stock actualizado exitosamente', product));
  } catch (error) {
    res.status(400).json(errorResponse(400, 'Error al actualizar stock', error));
  }
};

export const getProductsAdmin = async (req: Request, res: Response) => {
  try {
    // Solo ADMIN/VENDOR deberían llegar aquí por middleware en rutas
    const productRepository = new ProductRepositoryMongo();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filters = req.query;

    const products = await productRepository.findAllAdmin(filters, page, limit);
    res.json(successResponse(200, 'Productos (admin) obtenidos exitosamente', products));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener productos (admin)', error));
  }
};