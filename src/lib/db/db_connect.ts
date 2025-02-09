import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql, { PoolOptions } from "mysql2/promise";

const poolConfig: PoolOptions = {
 
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true,
};

const connectDealsDb = mysql.createPool({...poolConfig, uri: process.env.DEALS_DB_URL as string});
const connectFlipcartDb = mysql.createPool({
  ...poolConfig,
  uri: process.env.FLIPKART_DB_URL as string,
});
const connectUserDb = mysql.createPool({
  ...poolConfig,
  uri: process.env.USER_DB_URL as string,
});
const connectAJIODb = mysql.createPool({
  ...poolConfig,
  uri: process.env.AJIO_DB_URL as string,
});

export const deals_db = drizzle(connectDealsDb);
export const flipkart_db = drizzle(connectFlipcartDb);
export const user_db = drizzle(connectUserDb);
export const ajio_db = drizzle(connectAJIODb);
