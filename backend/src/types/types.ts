import mysql from 'mysql2/promise';

export interface News {
  id: string;
  topic: string;
  header: string;
  link: string;
  subtitle: string;
  date: string;
  userId: string;
  resource:string;
}

export interface DecodedToken {
    id: string,
    login: string,
    email: string,
    iat: number,
    exp: number
}

export interface User {
    id: string;
    login: string;
    email: string;
    password: string;
}

export interface DBOption {
    pool: mysql.Pool
}

export interface Task {
    id: string,
    name: string,
    userId: string,
    templateId: string
}

export interface Template {
    id: string,
    name: string,
    userId: string,
}