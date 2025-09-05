import express from 'express';
import type {Request, Response, NextFunction} from 'express';
import logger from '../services/logger.ts';
import AuthService from '../models/AuthService.ts';

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


