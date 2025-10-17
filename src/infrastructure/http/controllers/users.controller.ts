import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../../../shared/utils/responses';
import usersData from '../../persistence/data/mock/users.json';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs/promises';

const usersPath = path.join(__dirname, '..', '..', 'persistence', 'data', 'mock', 'users.json');

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, address } = req.body;

    const raw = await fs.readFile(usersPath, 'utf-8');
    const users = JSON.parse(raw) as any[];

    if (users.find(u => u.email === email)) {
      return res.status(409).json(errorResponse(409, 'El email ya está registrado'));
    }

    // Usar bcryptjs para generar hash consistente
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(String(password), salt);

    const now = new Date().toISOString();
    const newUser = {
      id: users.length + 1,
      email,
      password: hashed,
      name,
      phone,
      address,
      emailVerified: false,
      role: 'USER',
      createdAt: now,
      updatedAt: now
    };

    users.push(newUser);
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2), 'utf-8');

    return res.status(201).json(
      successResponse(
        {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          phone: newUser.phone,
          emailVerified: newUser.emailVerified,
          role: newUser.role,
          createdAt: newUser.createdAt
        },
        'Usuario creado exitosamente. Verifica tu email para activar la cuenta.'
      )
    );
  } catch (error: any) {
    return res.status(500).json(
      errorResponse(500, 'Error al crear usuario', error.message)
    );
  }
};

export const getUsers = (req: Request, res: Response) => {
  return fs.readFile(usersPath, 'utf-8')
    .then(raw => JSON.parse(raw))
    .then((users: any[]) => res.json(successResponse(users.map(u => ({ id: u.id, email: u.email, name: u.name, phone: u.phone, emailVerified: u.emailVerified, role: u.role })))) )
    .catch((err: any) => res.status(500).json(errorResponse(500, 'Error leyendo usuarios', err.message)));
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json(errorResponse(400, 'El id debe ser numérico'));
    const raw = await fs.readFile(usersPath, 'utf-8');
    const users = JSON.parse(raw) as any[];
    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json(errorResponse(404, 'Usuario no encontrado'));
    const { password, ...publicUser } = user;
    return res.json(successResponse(publicUser));
  } catch (err: any) {
    return res.status(500).json(errorResponse(500, 'Error leyendo usuario', err.message));
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json(errorResponse(400, 'Email y password son requeridos'));
    }

    const raw = await fs.readFile(usersPath, 'utf-8');
    const users = JSON.parse(raw) as any[];

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json(errorResponse(401, 'Credenciales inválidas'));
    }

    const storedHash = String(user.password || '').trim();
    const provided = String(password || '').trim();

    if (!storedHash.startsWith('$2a$') && !storedHash.startsWith('$2b$')) {
      console.error('Hash inválido para usuario:', email);
      return res.status(401).json(errorResponse(401, 'Credenciales inválidas'));
    }

    let valid = false;
    try {
      valid = bcrypt.compareSync(provided, storedHash);
      console.log('Resultado de bcrypt.compareSync:', valid);
    } catch (e) {
      console.error('Error en bcrypt.compareSync:', e);
    }

    if (!valid) {
      return res.status(401).json(errorResponse(401, 'Credenciales inválidas'));
    }

    const responseUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const tokens = {
      accessToken: 'mock-jwt-token-12345',
      refreshToken: 'mock-refresh-token-67890'
    };

    return res.json(successResponse({ user: responseUser, tokens }));
  } catch (err: any) {
    return res.status(500).json(errorResponse(500, 'Error en login', err.message));
  }
};
