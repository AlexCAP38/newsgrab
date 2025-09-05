import express from 'express';
import type {Request, Response, NextFunction} from 'express';
import AuthService from '../models/AuthService.ts';
import TaskController from '../models/TasksController.ts';
import {v4 as uuidv4} from 'uuid';
import logger from '../services/logger.ts';
import {AppError} from '../utils/returnModError.ts';

export default function tasksRouter(authService: AuthService, taskDB: TaskController) {
  const router = express.Router();

  // Получить задачи пользователя
  router.get('', async (req: Request, res: Response, next: NextFunction) => {

    try {
      const user = await authService.checkUser(req, res, next);

      if (user) {
        const news = await taskDB.read(user.id);
        res.status(200).json(news);
      }
    } catch (error) {
      if (error && typeof (error) === 'object' && 'message' in error && 'code' in error) {
        return res.status(error.code as number).json({message: error.message});
      }
    }
  })

  // Создать задачу пользователя
  router.post('', async (req: Request, res: Response, next: NextFunction) => {
    const {name, templateId} = req.body;
    let user = undefined;

    try {
      user = await authService.checkUser(req, res, next);

      if (user) {

        const task = {
          id: uuidv4(),
          name: name,
          userId: user.id,
          templateId: templateId
        }

        const result = await taskDB.create(task);
        res.status(201).json(result);
      }
    } catch (error) {
      if (typeof error === 'object' && error && 'isAppError' in error) {
        const appError = error as AppError;

        logger.info({...appError, ...user}, `MySQL: ${appError.message}`);
        return res.status(appError.code as number).json({message: appError.message});
      }

      logger.error(error, 'MySQl: Error creating rows in table TASKS');
      return res.status(500).json({message: 'Internal Server Error'});
    }
  })

  // Удалить задачу пользователя
  router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const {id: taskId} = req.params;

    try {
      const user = await authService.checkUser(req, res, next);

      if (user) {
        taskDB.delete(taskId, user.id).then((result) => res.status(200).json(result))
      }
    } catch (error) {
      if (error && typeof (error) === 'object' && 'message' in error && 'code' in error) {
        return res.status(error.code as number).json({message: error.message});
      }
    }

  })

  return router;
}