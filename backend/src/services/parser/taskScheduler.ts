import NewsController from "../../models/NewsController";
import TaskController from "../../models/TasksController";
import {fetchIrkKpNews} from "./adapters/irk_kp_ru";
import {fetchIrkNews} from "./adapters/irk_ru";
import {fetchLentaNews} from "./adapters/lenta_ru";
import {fetchNgsNews} from "./adapters/ngs_ru";

export function taskScheduler(taskDB: TaskController, newsDB: NewsController, intervalUpdate: number = 3_600_000): void {
    setInterval(async () => {

        // Получаем задания всех пользователей
        const tasks = await taskDB.readAllTasks();

        tasks.forEach((task) => {
            switch (task.templateId) {
                case 'lenta':
                    fetchLentaNews(task.userId)
                        .then((news) => {
                            newsDB.create(news);
                        })
                        .catch((error) => {
                            // TODO придумать что делать с парсером который вывалился в ошибку
                            console.log('упал парсер');
                        })

                    break;

                case 'ngs':
                    fetchNgsNews(task.userId)
                        .then((news) => {
                            newsDB.create(news);
                        })
                        .catch((error) => {
                            console.log('упал парсер');
                        })

                    break;

                case 'irk':
                    fetchIrkNews(task.userId)
                        .then((news) => {
                            newsDB.create(news);
                        })
                        .catch((error) => {
                            console.log('упал парсер');
                        })

                    break;

                case 'irkkp':
                    fetchIrkKpNews(task.userId)
                        .then((news) => {
                            newsDB.create(news);
                        })
                        .catch((error) => {
                            console.log('упал парсер');
                        })

                    break;


                default:
                    break;
            }


        })
    }, intervalUpdate);
}

// fetchNgsNews()
//     .then((response) => {
//         mysql.create(response);
//         res.send('ok');
//     })
//     .catch((error) => {
//         logger.error(error)
//         throw error
//     }
//     )

// setInterval(()=>{
//     fetchNgsNews()
//         .then((response) => {
//             mysql.create(response);
//         })
//         .catch((error) => {
//             logger.error(error)
//             throw error
//         }
//         )
// },600_000);