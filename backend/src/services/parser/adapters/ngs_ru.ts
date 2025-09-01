import request from 'request';
import * as cheerio from 'cheerio';
import type {News} from '../../../routes/newsList';
import {v4 as uuidv4} from 'uuid';
import logger from '../../logger';

/**
 * Получить новости с Ngs.ru
 * @returns {Promise<Array>} Массив новостей
 */

export function fetchNgsNews(userId: string): Promise<News[]> {
    return new Promise((resolve, reject) => {
        request('https://ngs.ru/text/', (error: any, response: request.Response, body: string) => {

            if (error) {
                logger.error(error, 'ADAPTER: NGS finished with critical error')
                return reject(error)
            }

            if (response.statusCode === 200) {

                const $ = cheerio.load(body)

                const news: News[] = [];
                $('.wrap_RL97A').each((i: number, elem: any) => {

                    const topic = $(elem).find('.labels_RL97A').text().trim();
                    const header = $(elem).find('.header_RL97A').text().trim();
                    const link = $(elem).find('.header_RL97A').prop('href');
                    const subtitle = $(elem).find('.subtitle_RL97A').text().trim() || '';
                    const date = $(elem).find('.cell_eiDCU').text().trim().match(/^.*[0-9]{2}:[0-9]{2}/) || new Date().toISOString();

                    // Не добавлять пустые новости
                    if (!topic && !header) return;

                    news.push({
                        id: uuidv4(),
                        topic,
                        header,
                        link,
                        subtitle,
                        date: date[0],
                        userId: userId
                    });
                })

                logger.info(`ADAPTER: NGS finished parsing news. Total news: ${news.length}`);
                return resolve(news);
            } else {

                logger.error({
                    code: response.statusCode,
                    message: response.statusMessage
                }, 'ADAPTER: Lenta finished with critical error');

                return reject(new Error(`Status: ${response.statusCode}, ${response.statusMessage}`));
            }
        })
    })
}