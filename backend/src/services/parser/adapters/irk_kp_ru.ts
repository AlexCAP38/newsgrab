import request from 'request';
import * as cheerio from 'cheerio';
import type {News} from '../../../routes/newsList';
import {v4 as uuidv4} from 'uuid';
import logger from '../../logger';

/**
 * Получить новости с Irk.kp.ru
 * @returns {Promise<Array>} Массив новостей
 */

export function fetchIrkKpNews(userId: string): Promise<News[]> {
    return new Promise((resolve, reject) => {
        request('https://www.irk.kp.ru/online/', (error: any, response: request.Response, body: string) => {


            if (error) {
                logger.error(error, 'ADAPTER: Irk.kp.ru finished with critical error')
                return reject(error)
            }

            if (response.statusCode === 200) {

                const $ = cheerio.load(body)

                const news: News[] = [];

                $('.sc-1tputnk-12').each((i: number, elem: any) => {

                    const topic = $(elem).find('.sc-1tputnk-11').text().trim();
                    const header = $(elem).find('.sc-1tputnk-2').text().trim();
                    const link = `https://www.irk.kp.ru` + $(elem).find('.sc-1tputnk-2').prop('href');
                    const subtitle = $(elem).find('.sc-1tputnk-3').text().trim() || '';
                    const date = $(elem).find('.sc-1tputnk-9').text().trim() || new Date().toISOString();

                    // Не добавлять пустые новости
                    if (!topic && !header) return;

                    news.push({
                        id: uuidv4(),
                        topic,
                        header,
                        link,
                        subtitle,
                        date: date,
                        userId: userId
                    });
                })

                logger.info(`ADAPTER: Irk.kp.ru finished parsing news. Total news: ${news.length}`);
                return resolve(news);

            }
            else {

                logger.error({
                    code: response.statusCode,
                    message: response.statusMessage
                }, 'ADAPTER: Lenta finished with critical error');

                return reject(new Error(`Status: ${response.statusCode}, ${response.statusMessage}`));
            }
        })
    })
}