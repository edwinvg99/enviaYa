import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  _id: string;
  role: 'USER' | 'ADMIN' | 'VENDOR';
  email: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 401, message: 'No autorizado. Token requerido.' }
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = { _id: decoded._id, role: decoded.role, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({
      success: false,
      error: { code: 401, message: 'Token inválido o expirado.' }
    });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 401, message: 'No autorizado' }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 403,
          message: `Acceso denegado. Se requiere uno de estos roles: ${roles.join(', ')}`
        }
      });
    }

    next();
  };
};
