import { Request, Response } from 'express';
import { RegisterUserService } from '../../../domain/users/services/RegisterUserService';
import { LoginUser } from '../../../application/users/use-cases/loginUser';
import { UserModel } from '../../persistence/data/models/UserModel';
import * as emailjs from '@emailjs/nodejs';
import jwt from 'jsonwebtoken';

const registerUserService = new RegisterUserService();
const loginUserService = new LoginUser();


export const registerUser = async (req: Request, res: Response) => {
  try {

    // 1) crear usuario
    req.body.role = 'USER'; //forzar a que sea usuario

    const user = await registerUserService.execute(req.body);

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET || 'clave_secreta',
      { expiresIn: '1h' }
    );

    await UserModel.findByIdAndUpdate(user._id, { verificationToken: token });

    const confirmationLink =
      `${process.env.BASE_URL}/api/v1/users/verify-email?token=${token}`;

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      {
        to_email: user.email,
        user_name: user.name ?? 'Usuario',
        confirmation_link: confirmationLink,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY!,
      }
    );

    return res.status(201).json({
      message: 'Usuario registrado correctamente. Revisa tu correo para verificar tu cuenta.',
      user,
    });
  } catch (err: any) {
    console.error('Error en registro:', err);
    return res.status(400).json({ error: err?.message ?? 'Error' });
  }
};




export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await loginUserService.execute({ email, password });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado o credenciales inválidas.' });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: 'Debes verificar tu cuenta antes de iniciar sesión.' });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user,
      token,
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

    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET || 'clave_secreta'
    ) as { email: string };

    const user = await UserModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido o usuario no encontrado.' });
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






