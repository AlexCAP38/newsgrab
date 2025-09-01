import express from 'express';
import type {Request, Response, NextFunction} from 'express';
import AuthService from '../models/AuthService.ts';
import TaskController from '../models/TasksController.ts';
import {v4 as uuidv4} from 'uuid';

export default function tasksRouter(authService: AuthService, taskDB: TaskController) {
  const router = express.Router();

  // Получить задачи пользователя
  router.get('', authService.checkUser, async (req: Request, res: Response, next: NextFunction) => {

    const user = (req as any).user;

    taskDB.read(user.id)
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((error) => {
        return res.status(500).json(error.message);
      })
  })

  // Создать задачу пользователя
  router.post('', authService.checkUser, async (req: Request, res: Response, next: NextFunction) => {

    const user = (req as any).user;

    const {name, templateId} = req.body;

    const task = {
      id: uuidv4(),
      name: name,
      userId: user.id,
      templateId: templateId
    }

    taskDB.create(task)
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

    taskDB.delete(id)
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