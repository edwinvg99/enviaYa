import { Request, Response } from 'express';
import { RegisterUserService } from '../../../domain/users/services/RegisterUserService';
import { LoginUser } from '../../../application/users/use-cases/loginUser'; // 👈 nuevo import

const registerUserService = new RegisterUserService();
const loginUserService = new LoginUser(); // 👈 instancia del caso de uso

// 👉 Controlador para registrar usuario
export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await registerUserService.execute(req.body);
    res.status(201).json({ message: 'Usuario registrado', user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// 👉 Controlador para iniciar sesión
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await loginUserService.execute({ email, password });

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};



