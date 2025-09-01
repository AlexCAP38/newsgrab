import express from 'express';
import type {Request, Response, NextFunction} from 'express';
import logger from '../services/logger.ts';
import AuthService from '../models/AuthService.ts';

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Авторизация пользователя
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Пользователь успешно авторизовался
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/UserLogin'
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email пользователя
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           description: Пароль пользователя
 */

export interface UserLogin {
    email: string;
    password: string;
}


export default function loginRouter(authService: AuthService) {
  const router = express.Router();

  return router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;

    logger.info({email}, 'SYSTEM: Trying to login user');

    authService.login(email, password)
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((error) => {
        return res.status(error.code).json({message: error.message});
      })
  })
}


