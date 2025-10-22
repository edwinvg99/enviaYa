import { Request, Response } from 'express';
import { RegisterUserService } from '../../../domain/users/services/RegisterUserService';
import { LoginUser } from '../../../application/users/use-cases/loginUser';
import { UserModel } from '../../persistence/data/models/UserModel'; // necesario para verificar token

const registerUserService = new RegisterUserService();
const loginUserService = new LoginUser();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await registerUserService.execute(req.body);
    res.status(201).json({
      message: 'Usuario registrado correctamente. Revisa tu correo para verificar tu cuenta.',
      user,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await loginUserService.execute({ email, password });
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user,
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const verifyUserEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Falta el token de verificación.' });
    }

    const user = await UserModel.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({
      message: ' Cuenta verificada correctamente. Ya puedes iniciar sesión.',
    });
  } catch (error) {
    console.error('Error al verificar email:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};





