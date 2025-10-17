import path from 'path';
import fs from 'fs/promises';
import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responses';

const productsPath = path.join(__dirname, '..', 'data', 'mock', 'products.json');
const categoriesPath = path.join(__dirname, '..', 'data', 'mock', 'categories.json');

type Product = {
	id: number;
	name: string;
	sku: string;
	description: string;
	price: number;
	stock: number;
	categoryId: number;
	active: boolean;
	images?: string[];
	weight?: number;
	createdAt?: string | Date;
	updatedAt?: string | Date;
};

export const getAllProducts = async (req: Request, res: Response) => {
	try {
		const raw = await fs.readFile(productsPath, 'utf-8');
		const products = JSON.parse(raw) as Product[];

		// eliminar campos no requeridos en listado
		const result = products.map(p => ({
			id: p.id,
			name: p.name,
			sku: p.sku,
			description: p.description,
			price: p.price,
			stock: p.stock,
			categoryId: p.categoryId,
			active: p.active,
			images: p.images,
			weight: p.weight
		}));

		return res.json(successResponse(result));
	} catch (err: any) {
		return res.status(500).json(errorResponse(500, 'Error leyendo productos', err.message));
	}
};

export const getProductById = async (req: Request, res: Response) => {
	try {
		const raw = await fs.readFile(productsPath, 'utf-8');
		const products = JSON.parse(raw) as Product[];
		const id = Number(req.params.id);
		if (Number.isNaN(id)) {
			return res.status(400).json(errorResponse(400, 'El id debe ser numérico'));
		}
		const product = products.find(p => p.id === id);
		if (!product) {
			return res.status(404).json(errorResponse(404, `Producto con id ${id} no encontrado`));
		}

		try {
			const rawCat = await fs.readFile(categoriesPath, 'utf-8');
			const categories = JSON.parse(rawCat) as any[];
			const category = categories.find(c => c.id === product.categoryId);
			const productWithCategory = {
				id: product.id,
				name: product.name,
				sku: product.sku,
				description: product.description,
				price: product.price,
				stock: product.stock,
				categoryId: product.categoryId,
				category: category ? { id: category.id, name: category.name, description: category.description } : undefined,
				active: product.active,
				images: product.images,
				weight: product.weight
			};

			return res.json(successResponse(productWithCategory));
		} catch (catErr: any) {
			// si falla la lectura de categorías, devolver producto sin categoría
			return res.json(successResponse(product));
		}
	} catch (err: any) {
		return res.status(500).json(errorResponse(500, 'Error leyendo producto', err.message));
	}
};

export const createProduct = async (req: Request, res: Response) => {
	try {
		const { name, sku, description, price, stock, categoryId, active, images, weight } = req.body;

		if (!name || !sku || !description || price === undefined || stock === undefined || !categoryId) {
			return res.status(400).json(
				errorResponse(400, 'Faltan campos requeridos: name, sku, description, price, stock, categoryId')
			);
		}

		if (typeof price !== 'number' || price < 0) {
			return res.status(400).json(errorResponse(400, 'El precio debe ser un número mayor o igual a 0'));
		}

		if (typeof stock !== 'number' || stock < 0) {
			return res.status(400).json(errorResponse(400, 'El stock debe ser un número mayor o igual a 0'));
		}

		const raw = await fs.readFile(productsPath, 'utf-8');
		const products = JSON.parse(raw) as Product[];

		if (products.find(p => p.sku === sku)) {
			return res.status(409).json(errorResponse(409, `El SKU '${sku}' ya existe`));
		}

		try {
			const rawCat = await fs.readFile(categoriesPath, 'utf-8');
			const categories = JSON.parse(rawCat) as any[];
			const categoryExists = categories.find(c => c.id === categoryId);
			
			if (!categoryExists) {
				return res.status(400).json(errorResponse(400, `La categoría con id ${categoryId} no existe`));
			}
		} catch (catErr) {
			return res.status(500).json(errorResponse(500, 'Error verificando categoría'));
		}

		const now = new Date().toISOString();
		const newProduct: Product = {
			id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
			name,
			sku,
			description,
			price,
			stock,
			categoryId,
			active: active !== undefined ? active : true,
			images: images || [],
			weight: weight || 0,
			createdAt: now,
			updatedAt: now
		};

		products.push(newProduct);

		await fs.writeFile(productsPath, JSON.stringify(products, null, 2), 'utf-8');

		return res.status(201).json(
			successResponse(
				{
					id: newProduct.id,
					name: newProduct.name,
					sku: newProduct.sku,
					description: newProduct.description,
					price: newProduct.price,
					stock: newProduct.stock,
					categoryId: newProduct.categoryId,
					active: newProduct.active,
					images: newProduct.images,
					weight: newProduct.weight,
					createdAt: newProduct.createdAt
				},
				'Producto creado exitosamente'
			)
		);
	} catch (err: any) {
		return res.status(500).json(errorResponse(500, 'Error creando producto', err.message));
	}
};
