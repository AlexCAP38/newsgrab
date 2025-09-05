import express from 'express';
import type {Request, Response, NextFunction} from 'express';
import logger from '../services/logger.ts';
import AuthService from '../models/AuthService.ts';
import validationLEP from '../utils/validationLEP.ts';

export interface UserRegistration {
    login: string;
    email: string;
    password: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserSuccessfully:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Токен пользователя
 */

export interface UserSuccessfully {
    token: string;
}

export default function registrationRouter(authService: AuthService) {
  const router = express.Router();

  return router.post('/registration', async (req: Request, res: Response, next: NextFunction) => {
    const {login, email, password} = req.body;

    logger.info({login, email}, 'SYSTEM: Trying to register user');

    // проверка данных на валидность
    const errors = validationLEP(login, email, password);
    if (errors.length > 0) return res.status(400).json({message: 'Validation error', errors});

    // регистрация пользователя
    authService.register(login, email, password).then((result:UserSuccessfully) => {
      return res.status(201).json(result);
    }).catch((error) => {
      if (error.code === 409) return res.status(error.code).json({message: error.message});
      return res.status(500).json({message: 'Internal Server Error'});
    })

  })
}


