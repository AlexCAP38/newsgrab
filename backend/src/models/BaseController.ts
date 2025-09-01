import mysql from 'mysql2/promise';
import logger from '../services/logger.ts';

export interface DBOption {
    host: string;
    database: string;
    user: string;
    password: string;
}

export default class BaseController {

    private host: string;
    private database: string;
    private user: string;
    private password: string;
    private pool!: mysql.Pool;

    constructor(option: DBOption) {
        this.host = option.host;
        this.database = option.database;
        this.user = option.user;
        this.password = option.password;
    }

    async connect(): Promise<void> {
        try {
            this.pool = await mysql.createPool({
                host: this.host,
                database: this.database,
                user: this.user,
                password: this.password,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
            logger.info('MySQL DataBase connected!');
        }
        catch (error) {
            logger.error('MySQL failed to connect to DataBase');
            throw error
        }
    }

    async create(query: string, params: any[] = []): Promise<any> {

    }

    async read(query: string, params: any[] = []): Promise<any> {

    }

    async update(query: string, params: any[] = []): Promise<any> {

    }

    async delete(query: string, params: any[] = []): Promise<any> {

    }

    async close(): Promise<void> {
        try {
            await this.pool.end();
            logger.info('SQL: The connection with MySQL was closed');
        }
        catch (error) {
            logger.error('SQL: Error closed with MySQL');
            throw error;
        }
    }
}