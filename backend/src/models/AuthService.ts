import logger from '../services/logger.ts';
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt';
import UserController from './UsersController.ts';
import jwt from 'jsonwebtoken';
import returnModError from '../utils/returnModError.ts';
import {Request, Response, NextFunction} from 'express';
import {DecodedToken} from '../types/types.ts';

export default class AuthService {

    private saltRounds: number;
    private secretKey: string;
    private userController: UserController;

    constructor(userController: UserController) {
        this.saltRounds = 10;
        this.secretKey = process.env.JWT_SECRET || 'Default-Your-seCret-Key!';
        this.userController = userController;
    }

    checkUser = async (req: Request, res: Response, next: NextFunction): Promise<DecodedToken | undefined> => {
        const {authorization} = req.headers;

        if (!authorization) {
            returnModError(401, 'Token is not available');
        }

        const token = authorization!.split(' ')[1];

        try {
            const decoded = await jwt.verify(token, this.secretKey) as DecodedToken
            return decoded;
        } catch (error) {
            if (error instanceof Error) {
                returnModError(402, error.message);
            }
        }
    }

    // Авторизация пользователя
    login = async (email: string, password: string): Promise<any> => {
        const users = await this.userController.readByEmail(email);

        if (!users.length) {
            returnModError(404, 'User not found');
        };

        if (users.length === 1) {
            const user = users[0];
            const isAuthorization = bcrypt.compareSync(password, user.password);

            if (isAuthorization) {
                // Генерация JWT
                const token = jwt.sign(
                    {
                        id: user.id,
                        login: user.login,
                        email: user.email
                    },
                    this.secretKey,
                    {expiresIn: '999h'} // время жизни токена
                );

                return {token: 'Bearer ' + token};
            }
            else {
                returnModError(409, 'Invalid password');
            }
        }

        if (users.length > 1) logger.warn({message: email}, 'SYSTEM: There are duplicate rows in table USERS the email');
    }

    // Регистрация пользователя
    register = async (login: string, email: string, password: string): Promise<any> => {
        try {
            // Проверка на занятость
            const row: {login: string; email: string}[] = await this.userController.readByLoginOrEmail(login, email);

            if (row.length > 0) {
                if (row[0].login === login) {
                    returnModError(409, 'Login already exists');
                };
                if (row[0].email === email) {
                    returnModError(409, 'Email already exists');
                }
            }

            const id = uuidv4();

            const salt = bcrypt.genSaltSync(this.saltRounds);
            const hashPassword = bcrypt.hashSync(password, salt);

            const result = await this.userController.create(id, login, email, hashPassword)

            // Генерация JWT
            const token = jwt.sign(
                {id, login, email},
                process.env.JWT_SECRET || 'your-secret-key',
                {expiresIn: '999h'} // время жизни токена
            );

            return {token};
        }
        catch (error) {
            logger.error({error: String(error)}, 'SYSTEM: Error created new user');

            if (error instanceof Error) {
                throw error;
            } else throw new Error(typeof error === 'object' ? JSON.stringify(error) : String(error));

        }
    }

    delete = async (query: string, params: any[] = []): Promise<any> => {
        // const [result] = await this.connection.execute(query, params);
        // return result;
    }
}