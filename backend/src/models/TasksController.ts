import mysql from 'mysql2/promise';
import logger from '../services/logger.ts';
import type {News} from '../routes/newsList.ts';
import {checkNews} from '../utils/checkNews.ts';
import type {DBOption, Task} from '../types/types.ts';

export default class TaskController {

    private pool!: mysql.Pool;

    constructor(option: DBOption) {
        this.pool = option.pool;
    }

    async create(task: Task): Promise<Task> {
        const {id, name, userId, templateId} = task;
        // const cleanNews = await checkNews([], this.pool);

        // if (cleanNews.length === 0) {
        //     return;
        // }

        // // Запись в базу
        // const placeholders = cleanNews.map(() => '(?, ?, ?, ?)').join(', ');
        // const valueFlat = cleanNews.flat();

        const query = 'INSERT INTO `tasks`(`id`, `name`, `userId`, `templateId`) VALUES (?, ?, ?, ?)';

        try {
            const [result, row] = await this.pool.execute(query, [id, name, userId, templateId]);
            logger.info({info: result}, 'MySQl: Create row in table TASKS');
            return task;
        }
        catch (error) {
            logger.error(error, 'MySQl: Error creating rows in table TASKS');
            throw error;
        }
    }

    async read(idUser: string): Promise<Task[]> {
        const query = 'SELECT * FROM `tasks` WHERE `userId` = ?';

        try {
            const [rows] = await this.pool.execute(query, [idUser]);
            return rows as Task[];
        }
        catch (error) {
            logger.error(error, 'MySQl: Error creating rows in table TASKS');
            throw new Error('Internal Server Error');
        }
    }

    async readAllTasks(): Promise<Task[]> {
        const query = 'SELECT * FROM `tasks`';

        try {
            const [rows] = await this.pool.execute(query, []);
            return rows as Task[];
        }
        catch (error) {
            logger.error(error, 'MySQl: Error reading rows in table TASKS');
            throw new Error('Internal Server Error');
        }
    }

    async update(query: string, params: any[] = []): Promise<any> {
        // const [result] = await this.connection.execute(query, params);
        // return result;
    }

    async delete(tasksId: string): Promise<any> {
        const queryDelete = 'DELETE FROM `tasks` WHERE `id` = ?';
        const querySelect = 'SELECT * FROM `tasks` WHERE `id` = ?';

        try {
            const [beforeDelete] = await this.pool.execute(querySelect, [tasksId]);

            if (Array.isArray(beforeDelete) && beforeDelete.length === 0) {
                return {message: `Tasks with id: ${tasksId} not found`};
            }

            const [result] = await this.pool.execute(queryDelete, [tasksId]);

            const [afterDelete] = await this.pool.execute(querySelect, [tasksId]);

            if (Array.isArray(afterDelete) && afterDelete.length === 0) return beforeDelete;
        }
        catch (error) {
            logger.error(error, 'MySQl: Error deleting row in table TASKS');
            throw new Error('Internal Server Error');
        }
    }
}