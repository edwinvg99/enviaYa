import { Request, Response, NextFunction } from 'express';

// Middleware de autenticación simulado (para desarrollo)
export const authenticate = (req: Request, res: Response, next: NextFunction) => {

  const userId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;

  if (!userId || !userRole) {
    return res.status(401).json({
      success: false,
      error: {
        code: 401,
        message: 'No autorizado. Debes incluir x-user-id y x-user-role en los headers'
      }
    });
  }

  req.user = {
    _id: userId,
    role: userRole as 'USER' | 'ADMIN' | 'VENDOR'
  };

  next();
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 401,
          message: 'No autorizado'
        }
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
