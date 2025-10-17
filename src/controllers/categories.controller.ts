import path from 'path';
import fs from 'fs/promises';
import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responses';

const categoriesPath = path.join(__dirname, '..', 'data', 'mock', 'categories.json');

type Category = {
  id: number;
  name: string;
  description: string;
  active: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const raw = await fs.readFile(categoriesPath, 'utf-8');
    const categories = JSON.parse(raw) as Category[];

    const activeOnly = req.query.active === 'true';
    const result = activeOnly 
      ? categories.filter(c => c.active)
      : categories;

    return res.json(successResponse(result));
  } catch (err: any) {
    return res.status(500).json(errorResponse(500, 'Error leyendo categorías', err.message));
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const raw = await fs.readFile(categoriesPath, 'utf-8');
    const categories = JSON.parse(raw) as Category[];
    const id = Number(req.params.id);
    
    if (Number.isNaN(id)) {
      return res.status(400).json(errorResponse(400, 'El id debe ser numérico'));
    }

    const category = categories.find(c => c.id === id);
    
    if (!category) {
      return res.status(404).json(errorResponse(404, `Categoría con id ${id} no encontrada`));
    }

    return res.json(successResponse(category));
  } catch (err: any) {
    return res.status(500).json(errorResponse(500, 'Error leyendo categoría', err.message));
  }
};
