import mysql from 'mysql2/promise';
import logger from '../services/logger.ts';
import {checkNews} from '../utils/checkNews.ts';
import {DBOption, News} from '../types/types.ts';
import returnModError from '../utils/returnModError.ts';

export default class NewsController {

    private pool!: mysql.Pool;

    constructor(option: DBOption) {
        this.pool = option.pool;
    }

    async create(news: News[]): Promise<any> {

        // Проверяем на дубликаты
        const cleanNews = await checkNews(news, this.pool);

        if (cleanNews.length === 0) {
            return;
        }

        // Запись в базу
        const placeholders = cleanNews.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(', ');
        const valueFlat = cleanNews.flat();

        const query = 'INSERT INTO `news`(`id`, `topic`, `header`, `link`, `subtitle`, `date`, `userId`) VALUES' + `${placeholders}`;

        try {
            const [result, fields] = await this.pool.execute(query, valueFlat);
            logger.info({info: result}, 'MySQl: Create rows in table');
        }
        catch (error) {
            logger.error(error, 'MySQl: Error created rows in table News');
            returnModError(500, 'Internal Server Error');
        }
    }

    async read(idUser: string): Promise<News[] | undefined> {

        // const query = 'SELECT * FROM `news` WHERE `idUsers` = ?';
        const query = 'SELECT * FROM `news`';

        try {
            // const [rows] = await this.pool.execute(query, idUser);
            const [rows] = await this.pool.execute(query, []);
            return rows as News[];
        }
        catch (error) {
            logger.error(error, `MySQl: Error read rows in table News. Userid: ${idUser}`);
            returnModError(500, 'Internal Server Error');
        }
    }

    async update(query: string, params: any[] = []): Promise<any> {
        // const [result] = await this.connection.execute(query, params);
        // return result;
    }

    async delete(query: string, params: any[] = []): Promise<any> {
        // const [result] = await this.connection.execute(query, params);
        // return result;
    }

    async close(): Promise<void> {
        try {
            await this.pool.end();
            logger.info('The connection with MySQL was closed');
        }
        catch (error) {
            logger.error('Error closed with MySQL');
            throw error;
        }

    }
}