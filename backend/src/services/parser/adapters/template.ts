import request from 'request';
import * as cheerio from 'cheerio';
import type {News} from '../../../routes/newsList';
import {v4 as uuidv4} from 'uuid';
import logger from '../../logger';

/**
 * Получить новости с Ngs.ru
 * @returns {Promise<Array>} Массив новостей
 */

interface Options {
    url:string,
    section:string,
    topic: string,
    header: string,
    link: string,
    subtitle: string,
    date: string
}

export function fetchTempalteNews(userId: string, options: Options): Promise<News[]> {
    return new Promise((resolve, reject) => {
        request(options.url, (error: any, response: request.Response, body: string) => {

            if (error) {
                logger.error(error, 'ADAPTER: NGS finished with critical error')
                return reject(error)
            }
            if (response.statusCode === 200) {

                const $ = cheerio.load(body)

     console.log($);

                const news: News[] = [];

                $(options.section).each((i: number, elem: any) => {

                    console.log(elem);
                    const topic = $(elem).find(options.topic).text().trim();
                    const header = $(elem).find(options.header).text().trim();
                    const link = $(elem).find(options.link).prop('href');
                    const subtitle = $(elem).find(options.subtitle).text().trim();
                    const date = $(elem).find(options.date).text().trim().match(/^.*[0-9]{2}:[0-9]{2}/) || new Date().toISOString();

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

                console.log(news);
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



fetchTempalteNews('1',{

    url:'https://www.newsvl.ru/',
    section:'story-list__item',
    topic: 'story-list__item-category',
    header: 'story-list__item-title',
    link: 'story-list__image_main',
    subtitle: 'story-list__item-overview',
    date: 'story-list__item-date'

})