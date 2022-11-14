import * as dotenv from 'dotenv';
dotenv.config('.env');
const keys = [process.env.YOUTUBE_API_KEY1, process.env.YOUTUBE_API_KEY2, process.env.YOUTUBE_API_KEY3];
export const YOUTUBE_API_KEY1 = process.env.YOUTUBE_API_KEY1;
export const YOUTUBE_API_KEY2 = process.env.YOUTUBE_API_KEY2;
export const YOUTUBE_API_KEY3 = process.env.YOUTUBE_API_KEY3;

let i = 0;
export const YOUTUBE_API_KEY = () => {
    if (i === 3) i = 0;
    return keys[i++];
};

export const port = Number(process.env.PORT);
export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_DATABASE = process.env.DB_DATABASE;
export const DB_PORT = process.env.DB_PORT;