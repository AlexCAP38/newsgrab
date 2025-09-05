import express from 'express';
import type {Request, Response, NextFunction} from 'express';
import logger from '../services/logger.ts';
import AuthService from '../models/AuthService.ts';
import NewsController from '../models/NewsController.ts';

export default function newsList(authService: AuthService, newsDB: NewsController) {
  const router = express.Router();

  return router.get('', async (req: Request, res: Response, next: NextFunction) => {

    const {authorization} = req.headers;

    const token = authorization?.split(' ')[1];

    if (!token) return res.status(401).json({message: 'Token is not available'});

    try {
      const user = await authService.checkUser(req, res, next);

      if (user) {
        const news = await newsDB.read(user.id);
        res.status(200).json(news);
      }
    } catch (error) {
      if (error && typeof (error) === 'object' && 'message' in error && 'code' in error)
        return res.status(error.code as number).json({message: error.message});
    }
  })
}


