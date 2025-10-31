import { Request, Response } from 'express';
import { UserModel } from '../../persistence/data/models/UserModel';
import bcrypt from 'bcryptjs';

export const createAdminUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validaciones básicas
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    // Verificar si ya existe
    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'El correo ya está en uso' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario admin
    const newAdmin = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN',
      isVerified: true // los crea directamente verificados
    });

    await newAdmin.save();

    res.status(201).json({
      message: 'Administrador creado con éxito por SUPER ADMIN',
      user: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role }
    });
  } catch (error: any) {
    console.error('Error al crear admin:', error);
    res.status(500).json({ message: 'Error interno al crear admin' });
  }
};
