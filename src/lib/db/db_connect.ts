import 'dotenv/config'
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const poolConfig = {
  connectionLimit: 10,  // Adjust this number based on your needs and server capacity
  queueLimit: 0,
  waitForConnections: true,
};

const connectDealsDb = mysql.createPool(process.env.DEALS_DB_URL as string, poolConfig);
const connectFlipcartDb = mysql.createPool(process.env.FLIPKART_DB_URL as string, poolConfig);
const connectUserDb = mysql.createPool(process.env.USER_DB_URL as string, poolConfig);
const connectAJIODb = mysql.createPool(process.env.AJIO_DB_URL as string, poolConfig);

export const deals_db = drizzle(connectDealsDb);
export const flipkart_db = drizzle(connectFlipcartDb);
export const user_db = drizzle(connectUserDb);
export const ajio_db = drizzle(connectAJIODb);