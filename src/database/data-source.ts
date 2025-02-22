import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { Document } from '../documents/document.entity';
import { IngestionProcess } from '../ingestion/ingestion.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'abhishek123',
  database: process.env.DB_NAME || 'docs_manage_jktech',
  entities: [User, Role, Document, IngestionProcess],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Ensure it's false for migrations
  logging: true,
});
