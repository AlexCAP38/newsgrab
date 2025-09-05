import mysql from 'mysql2/promise';
import logger from '../services/logger.ts';
import {DBOption, Task} from '../types/types.ts';
import returnModError, {appError} from '../utils/returnModError.ts';

export default class TaskController {

    private pool!: mysql.Pool;

    constructor(option: DBOption) {
        this.pool = option.pool;
    }

    async create(task: Task): Promise<Task[] | void> {
        const {id, name, userId, templateId} = task;

        const queryCreate = 'INSERT INTO `tasks`(`id`, `name`, `userId`, `templateId`) VALUES (?, ?, ?, ?)';
        const queryResult = 'SELECT * FROM `tasks` WHERE `userId` = ?';
        const queryChecking = 'SELECT * FROM `tasks` WHERE `templateId` = ?';

        // Проверка на дубликат названию шаблона
        const [taskExists] = await this.pool.execute(queryChecking, [templateId]);

        if (Array.isArray(taskExists) && taskExists.length !== 0) throw appError(409, 'The task exists');

        // Запись
        await this.pool.execute(queryCreate, [id, name, userId, templateId]);
        logger.info({info: task}, 'MySQl: Create row in table TASKS');

        const [result] = await this.pool.execute(queryResult, [userId]);

        return result as Task[];
    }

    async read(idUser: string): Promise<Task[] | undefined> {
        const query = 'SELECT * FROM `tasks` WHERE `userId` = ?';

        try {
            const [rows] = await this.pool.execute(query, [idUser]);
            return rows as Task[];
        }
        catch (error) {
            logger.error(error, 'MySQl: Error reading rows in table TASKS');
            returnModError(500, 'Internal Server Error');
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

    async delete(tasksId: string, userId: string): Promise<Task[] | undefined> {
        const queryDelete = 'DELETE FROM `tasks` WHERE `id` = ?';
        const querySelect = 'SELECT * FROM `tasks` WHERE `id` = ?';
        const queryResult = 'SELECT * FROM `tasks` WHERE `userId` = ?';

        try {
            // Проверяем существует задача
            const [checkTaskBeforeDelete] = await this.pool.execute(querySelect, [tasksId]);

            if (Array.isArray(checkTaskBeforeDelete) && checkTaskBeforeDelete.length === 0) {
                returnModError(404, `Tasks with id: ${tasksId} not found`);
            }

            // Удаляем
            const [result] = await this.pool.execute(queryDelete, [tasksId]);

            // Возвращаем список оставшихся задач
            const [afterDelete] = await this.pool.execute(queryResult, [userId]);

            return afterDelete as Task[];
        }
        catch (error) {
            logger.error(error, 'MySQl: Error deleting row in table TASKS');
            returnModError(500, 'Internal Server Error');
        }
    }
}