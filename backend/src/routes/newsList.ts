import express from 'express';
import type {Request, Response, NextFunction} from 'express';
import logger from '../services/logger.ts';
import AuthService from '../models/AuthService.ts';
import NewsController from '../models/NewsController.ts';

/**
 * @swagger
 * /newsList:
 *   get:
 *     summary: Получить список новостей
 *     tags:
 *       - News
 *     responses:
 *       200:
 *         description: Список новостей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/News'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     News:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Идентификатор
 *         topic:
 *           type: string
 *           nullable: true
 *           description: Тематика новости
 *         header:
 *           type: string
 *           description: Заголовок
 *         link:
 *           type: string
 *           description: Ссылка на новость
 *         subtitle:
 *           type: string
 *           nullable: true
 *           description: Подзаголовок
 *         date:
 *           type: string
 *           nullable: true
 *           description: Дата публикации
 */

export interface News {
  id: string;
  topic: string;
  header: string;
  link: string;
  subtitle: string;
  date: string;
  userId: string;
}

export default function newsList(authService: AuthService, newsDB: NewsController) {
  const router = express.Router();

  return router.get('', async (req: Request, res: Response, next: NextFunction) => {

    const {authorization} = req.headers;

    const token = authorization?.split(' ')[1];

    if (!token) return res.status(401).json({message: 'Token is not available'});

    try {
      const user = await authService.checkUser(req, res, next)

      // if (user && typeof (user) === 'object' && 'id' in user) {
      //   console.log(

      //     // await newsDB.read(user.id)
      //   );


      // }

    } catch (error) {
      if (error && typeof (error) === 'object' && 'message' in error && 'code' in error)
        return res.status(error.code as number).json({message: error.message});
    }

  })
}


