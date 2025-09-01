import type {News} from "../routes/newsList.ts";
import mysql from 'mysql2/promise';
import type {Pool} from 'mysql2/promise';
import logger from '../services/logger.ts';

/**
 * Проверяет список новостей на наличие дубликатов в базе данных.
 * Для каждой новости выполняется поиск по ссылке или заголовку.
 * Осуществляется подрезка данных под длину таблицы.
 * Если новость отсутствует в базе, она добавляется в результирующий массив.
 * Ведется подсчет новых и дублирующихся новостей, информация логируется.
 *
 * @param news Массив новостей для проверки.
 * @param pool Экземпляр пула соединений с базой данных MySQL.
 * @returns Возвращает массив новостей, которые отсутствуют в базе данных (уникальные).
 */

export async function checkNews(news: News[], pool: Pool): Promise<string[][]> {

    let checkedNews: News[] = [];
    let cleanNews: string[][] = [];

    // Счетчики обработки
    let countNews = 0;
    let countDuplicateNews = 0;

    for (const item of news) {
        let queryCheck = undefined;
        let valueCheck = undefined;

        if (item.link.length > 1) {
            queryCheck = 'SELECT * FROM `news` WHERE `link` = ?';
            valueCheck = [item.link];
        } else {
            queryCheck = 'SELECT * FROM `news` WHERE `header` = ?';
            valueCheck = [item.header];
        }

        const [rows] = await pool.execute<mysql.RowDataPacket[]>(queryCheck, valueCheck)

        if (rows.length === 0) {
            checkedNews.push(item);
            countNews += 1;
        } else {
            countDuplicateNews += 1;
        }
    }

    // подрезка данных
    cleanNews = checkedNews.reduce<string[][]>((acc, item) => {
        const trim = (str: string, max: number) => str.length > max ? str.slice(0, max) : str;

        acc.push([
            trim(item.id, 36),
            trim(item.topic, 50),
            trim(item.header, 500),
            trim(item.link, 255),
            trim(item.subtitle, 255),
            trim(item.date, 50),
            trim(item.userId, 36)
        ]);

        return acc
    }, []);

    logger.info(`SQL: Checked News on Duplicate in DB. newNews: ${countNews}, duplicateNews: ${countDuplicateNews}`)

    return cleanNews;
}