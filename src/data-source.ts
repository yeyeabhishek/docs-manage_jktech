import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'abhishek123',
  database: process.env.DB_NAME || 'docs_manage_jktech',
  synchronize: false,
  migrations: ['dist/migrations/*.js'], 
  entities: ['dist/**/*.entity.js'],
  logging: true,
});

export default AppDataSource;
