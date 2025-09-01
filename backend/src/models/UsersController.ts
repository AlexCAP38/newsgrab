import mysql from 'mysql2/promise';
import logger from '../services/logger.ts';
import type {DBOption, User} from '../types/types.ts';

export default class UsersController {

    private pool!: mysql.Pool;

    constructor(option: DBOption) {
        this.pool = option.pool;
    }

    async create(id: string, login: string, email: string, hashPassword: string): Promise<any> {
            const query = 'INSERT INTO `users`(`id`, `login`, `email`, `password`) VALUES (?, ?, ?, ?)';
            const [result, fields] = await this.pool.execute(query, [id, login, email, hashPassword]);
            return result
    }

    async readByLoginOrEmail(login?: string, email?: string): Promise<any> {
        const query = 'SELECT `login`, `email` FROM `users` WHERE `login` = ? OR `email` = ? LIMIT 1';
        const [row] = await this.pool.execute(query, [login, email]);
        return row;
    }

    async readByEmail(email: string): Promise<User[]> {
        const query = 'SELECT * FROM `users` WHERE `email` = ?';
        const [row] = await this.pool.execute(query, [email]);
        return row as User[];
    }

    async update(query: string, params: any[] = []): Promise<any> {
        // const [result] = await this.connection.execute(query, params);
        // return result;
    }

    async delete(query: string, params: any[] = []): Promise<any> {
        // const [result] = await this.connection.execute(query, params);
        // return result;
    }
}