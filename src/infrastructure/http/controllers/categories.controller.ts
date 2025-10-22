import { Request, Response } from 'express';
import { CategoryRepositoryMongo } from '../../persistence/mongo/repositories/CategoryRepositoryMongo';
import { CreateCategoryUseCase } from '../../../application/categories/use-cases/CreateCategoryUseCase';
import { UpdateCategoryUseCase } from '../../../application/categories/use-cases/UpdateCategoryUseCase';
import { DeleteCategoryUseCase } from '../../../application/categories/use-cases/DeleteCategoryUseCase';
import { successResponse, errorResponse } from '../../../shared/utils/responses';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categoryRepository = new CategoryRepositoryMongo();
    const categories = await categoryRepository.findAll();
    
    res.json(successResponse(200, 'Categorías obtenidas exitosamente', categories));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener categorías', error));
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const categoryRepository = new CategoryRepositoryMongo();
    const category = await categoryRepository.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json(errorResponse(404, 'Categoría no encontrada'));
    }
    
    res.json(successResponse(200, 'Categoría obtenida exitosamente', category));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener categoría', error));
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const createCategoryUseCase = new CreateCategoryUseCase();
    const userRole = req.user!.role;
    
    const category = await createCategoryUseCase.execute(req.body, userRole);
    
    res.status(201).json(successResponse(201, 'Categoría creada exitosamente', category));
  } catch (error) {
    res.status(400).json(errorResponse(400, 'Error al crear categoría', error));
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const updateCategoryUseCase = new UpdateCategoryUseCase();
    const userRole = req.user!.role;
    
    const category = await updateCategoryUseCase.execute(req.params.id, req.body, userRole);
    
    if (!category) {
      return res.status(404).json(errorResponse(404, 'Categoría no encontrada'));
    }
    
    res.json(successResponse(200, 'Categoría actualizada exitosamente', category));
  } catch (error) {
    res.status(400).json(errorResponse(400, 'Error al actualizar categoría', error));
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const deleteCategoryUseCase = new DeleteCategoryUseCase();
    const userRole = req.user!.role;
    
    const deleted = await deleteCategoryUseCase.execute(req.params.id, userRole);
    
    if (!deleted) {
      return res.status(404).json(errorResponse(404, 'Categoría no encontrada'));
    }
    
    res.json(successResponse(200, 'Categoría eliminada exitosamente'));
  } catch (error) {
    res.status(400).json(errorResponse(400, 'Error al eliminar categoría', error));
  }
};