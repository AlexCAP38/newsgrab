import request from 'request';
import * as cheerio from 'cheerio';
import type {News} from '../../../routes/newsList';
import {v4 as uuidv4} from 'uuid';
import logger from '../../logger';

/**
 * Получить новости с Irk.ru.ru
 * @returns {Promise<Array>} Массив новостей
 */

export function fetchIrkNews(userId: string): Promise<News[]> {
    return new Promise((resolve, reject) => {
        request('https://www.irk.ru/news/', (error: any, response: request.Response, body: string) => {

            if (error) {
                logger.error(error, 'ADAPTER: Irk.ru finished with critical error')
                return reject(error)
            }

            if (response.statusCode === 200) {

                const $ = cheerio.load(body)

                const news: News[] = [];

                $('.b-news-article-list-item').each((i: number, elem: any) => {

                    const topic = $(elem).find('.labels_RL97A').text().trim() || "";
                    const header = $(elem).find('h2').text().trim();
                    const link = `https://irk.ru` + $(elem).find('a').prop('href');
                    const subtitle = $(elem).find('.g-overflow p').text().trim();
                    const date = $(elem).find('time').prop('datetime') || new Date().toISOString();

                    // Не добавлять пустые новости
                    if (!header) return;

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

                logger.info(`ADAPTER: Irk.ru finished parsing news. Total news: ${news.length}`);
                return resolve(news);

            } else {
                logger.error({
                    code: response.statusCode,
                    message: response.statusMessage
                }, 'ADAPTER: Irk.ru finished with critical error');

                return reject(new Error(`Status: ${response.statusCode}, ${response.statusMessage}`));
            }
        })
    })
}