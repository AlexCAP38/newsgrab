import express from 'express';
import type {Request, Response, NextFunction} from 'express';
import AuthService from '../models/AuthService.ts';
import TemplatesController from '../models/TemplatesController.ts';
import {v4 as uuidv4} from 'uuid';

export default function templatesRouter(authService: AuthService, templateDB: TemplatesController) {
  const router = express.Router();

  // Получить шаблоны
  router.get('', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.checkUser(req, res, next);

      if (user) {
        const news = await templateDB.read(user.id);
        res.status(200).json(news);
      }
    } catch (error) {
      if (error && typeof (error) === 'object' && 'message' in error && 'code' in error) {
        return res.status(error.code as number).json({message: error.message});
      }
    }
  })

  // Создать задачу пользователя
  router.post('', authService.checkUser, async (req: Request, res: Response, next: NextFunction) => {

    const user = (req as any).user;

    const {name, templateId} = req.body;

    const template = {
      id: uuidv4(),
      name: name,
      userId: user.id,
    }

    templateDB.create(template)
      .then((result) => {
        return res.status(201).json(result);
      })
      .catch((error) => {
        return res.status(500).json(error.message);
      })
  })

  // Удалить задачу пользователя
  router.delete('/:id', authService.checkUser, async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;

    templateDB.delete(id)
      .then((result) => {
        return Array.isArray(result) ?
          res.status(200).json(result)
          :
          res.status(404).json(result)
      })
      .catch((error) => {
        return res.status(500).json(error.message);
      })
  })

  return router;
}