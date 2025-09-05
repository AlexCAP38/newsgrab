import express from 'express';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';
import mysql from 'mysql2/promise';
import logger from './services/logger.ts';
import {swaggerSpec} from './swagger/swagger.ts';

import NewsController from './models/NewsController.ts';
import UsersController from './models/UsersController.ts';
import AuthService from './models/AuthService.ts';
import TaskController from './models/TasksController.ts';
import TemplatesController from './models/TemplatesController.ts';
import {taskScheduler} from './services/parser/taskScheduler.ts';

import registrationRouter from './routes/registration.ts';
import loginRouter from './routes/login.ts';
import newsList from './routes/newsList.ts';
import tasksRouter from './routes/tasks.ts';
import templatesRouter from './routes/templates.ts';

if (!process.env.HOST_NAME ||
    !process.env.BASE_NAME ||
    !process.env.SQL_USER ||
    !process.env.SQL_PWD
) {
    logger.error('Missing ENV variables!');
    process.exit(1);
}

const sqlPool = mysql.createPool({
    host: process.env.HOST_NAME,
    database: process.env.BASE_NAME,
    user: process.env.SQL_USER,
    password: process.env.SQL_PWD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const usersDB = new UsersController({pool: sqlPool});
const newsDB = new NewsController({pool: sqlPool});
const taskDB = new TaskController({pool: sqlPool});
const templateDB = new TemplatesController({pool: sqlPool});
const authService = new AuthService(usersDB);

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // разрешаем фронт
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // ответ на preflight
  }
  next();
});


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(undefined, {
    swaggerOptions: {
        url: '/swagger.json',
    },
})
);

app.get('/swagger.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec); // это твой swaggerSpec из swagger-jsdoc
});

app.use('/user', registrationRouter(authService));
app.use('/user', loginRouter(authService));
app.use('/news', newsList(authService, newsDB));
app.use('/tasks', tasksRouter(authService, taskDB));
app.use('/templates', templatesRouter(authService, templateDB));

app.listen(8888);


taskScheduler(taskDB, newsDB, 600_000); //Каждые десять минут проверять