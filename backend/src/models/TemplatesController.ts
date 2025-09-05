import mysql from 'mysql2/promise';
import logger from '../services/logger.ts';
import type {DBOption, Template} from '../types/types.ts';
import returnModError from '../utils/returnModError.ts';

export default class TemplatesController {

    private pool!: mysql.Pool;

    constructor(option: DBOption) {
        this.pool = option.pool;
    }

    async create(template: Template): Promise<Template | undefined> {
        const {id, name, userId} = template;
        // const cleanNews = await checkNews([], this.pool);

        // if (cleanNews.length === 0) {
        //     return;
        // }

        // // Запись в базу
        // const placeholders = cleanNews.map(() => '(?, ?, ?, ?)').join(', ');
        // const valueFlat = cleanNews.flat();

        const query = 'INSERT INTO `templates`(`id`, `name`, `userId`) VALUES (?, ?, ?)';

        try {
            const [result, row] = await this.pool.execute(query, [id, name, userId]);
            logger.info({info: result}, 'MySQl: Create row in table TEMPLATE');
            return template;
        }
        catch (error) {
            logger.error(error, 'MySQl: Error creating rows in table TEMPLATES');
            returnModError(500,'Internal Server Error');
        }
    }

    async read(idUser: string): Promise<Template[] | undefined> {
        const query = 'SELECT * FROM `templates` WHERE `userId` = ? OR `userId` = "any"';

        try {
            const [rows] = await this.pool.execute(query, [idUser]);
            return rows as Template[];
        }
        catch (error) {
            logger.error(error, 'MySQl: Error reading rows in table TEMPLATES');
            returnModError(500,'Internal Server Error');
        }
    }

    async update(query: string, params: any[] = []): Promise<any> {
        // const [result] = await this.connection.execute(query, params);
        // return result;
    }

    async delete(templateId: string): Promise<any> {
        const queryDelete = 'DELETE FROM `templates` WHERE `id` = ?';
        const querySelect = 'SELECT * FROM `templates` WHERE `id` = ? LIMIT 1';

        try {
            const [beforeDelete] = await this.pool.execute(querySelect, [templateId]);

            if (Array.isArray(beforeDelete) && beforeDelete.length === 0) {
                return {message: `Template with id: ${templateId} not found`};
            }

            if (Array.isArray(beforeDelete) && 'userId' in beforeDelete[0] && beforeDelete[0].userId === null) {
                return {message: `Deleting system template not correct`};
            }

            const [result] = await this.pool.execute(queryDelete, [templateId]);

            const [afterDelete] = await this.pool.execute(querySelect, [templateId]);

            if (Array.isArray(afterDelete) && afterDelete.length === 0) return beforeDelete;
        }
        catch (error) {
            logger.error(error, 'MySQl: Error deleting row in table TASKS');
            throw new Error('Internal Server Error');
        }
    }
}