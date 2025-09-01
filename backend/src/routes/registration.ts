import express from 'express';
import type {Request, Response, NextFunction} from 'express';
import logger from '../services/logger.ts';
import AuthService from '../models/AuthService.ts';
import validationLEP from '../utils/validationLEP.ts';

/**
 * @swagger
 * /registration:
 *   post:
 *     summary: Регистрация пользователя
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/UserSuccessfully'
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegistration:
 *       type: object
 *       required:
 *         - login
 *         - email
 *         - password
 *       properties:
 *         token:
 *           type: string
 *           description: Токен пользователя
 *         email:
 *           type: string
 *           format: email
 *           description: email пользователя
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           description: пароль пользователя
 */

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


