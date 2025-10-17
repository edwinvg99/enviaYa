import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(3).required(),
    phone: Joi.string().pattern(/^\+57\d{10}$/).required(),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.string().required()
    }).required()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: {
        code: 400,
        message: 'Datos de entrada inválidos',
        details: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message
        }))
      }
    });
  }
  
  next();
};
