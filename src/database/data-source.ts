import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { Document } from '../documents/document.entity';
import { IngestionProcess } from '../ingestion/ingestion.entity';

/**
 * Configuring and initializing the TypeORM data source for the application.
 */
export const AppDataSource = new DataSource({
  /** 
   * Database type being used.
   */
  type: 'postgres',

  /** 
   * Database host, retrieved from environment variables or defaulting to 'localhost'.
   */
  host: process.env.DB_HOST || 'localhost',

  /** 
   * Database port, retrieved from environment variables or defaulting to 5432.
   */
  port: Number(process.env.DB_PORT) || 5432,

  /** 
   * Database username, retrieved from environment variables or defaulting to 'postgres'.
   */
  username: process.env.DB_USERNAME || 'postgres',

  /** 
   * Database password, retrieved from environment variables or defaulting to 'abhishek123'.
   */
  password: process.env.DB_PASSWORD || 'abhishek123',

  /** 
   * Database name, retrieved from environment variables or defaulting to 'docs_manage_jktech'.
   */
  database: process.env.DB_NAME || 'docs_manage_jktech',

  /** 
   * List of entities (database models) used in the application.
   */
  entities: [User, Role, Document, IngestionProcess],

  /** 
   * Path to migration files for database schema updates.
   */
  migrations: ['src/migrations/*.ts'],

  /** 
   * Controls whether TypeORM should synchronize the database schema automatically. 
   * Set to `false` to avoid unintended schema changes.
   */
  synchronize: false,

  /** 
   * Enables logging of database queries and errors.
   */
  logging: true,
});
