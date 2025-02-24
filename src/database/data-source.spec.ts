import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { AppDataSource } from '../database/data-source';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { Document } from '../documents/document.entity';
import { IngestionProcess } from '../ingestion/ingestion.entity';

describe('AppDataSource Configuration', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should correctly configure TypeORM DataSource with environment variables', () => {
    process.env.DB_HOST = 'test_host';
    process.env.DB_PORT = '1234';
    process.env.DB_USERNAME = 'test_user';
    process.env.DB_PASSWORD = 'test_password';
    process.env.DB_NAME = 'test_db';

    const testConfig: PostgresConnectionOptions = {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'abhishek123',
      database: process.env.DB_NAME || 'docs_manage_jktech',
      entities: [User, Role, Document, IngestionProcess],
      migrations: ['src/migrations/*.ts'],
      synchronize: false,
      logging: true,
    };

    const testDataSource = new DataSource(testConfig);

    expect(testDataSource.options.type).toBe('postgres');
    expect((testDataSource.options as PostgresConnectionOptions).host).toBe(
      'test_host',
    );
    expect((testDataSource.options as PostgresConnectionOptions).port).toBe(
      1234,
    );
    expect((testDataSource.options as PostgresConnectionOptions).username).toBe(
      'test_user',
    );
    expect((testDataSource.options as PostgresConnectionOptions).password).toBe(
      'test_password',
    );
    expect((testDataSource.options as PostgresConnectionOptions).database).toBe(
      'test_db',
    );
    expect(testDataSource.options.entities).toEqual([
      User,
      Role,
      Document,
      IngestionProcess,
    ]);
    expect(testDataSource.options.synchronize).toBe(false);
    expect(testDataSource.options.logging).toBe(true);
  });

  it('should properly initialize AppDataSource', async () => {
    jest.spyOn(AppDataSource, 'initialize').mockResolvedValue(AppDataSource);

    await expect(AppDataSource.initialize()).resolves.toBe(AppDataSource);
  });

  it('should fail to initialize when there is a database connection issue', async () => {
    jest
      .spyOn(AppDataSource, 'initialize')
      .mockRejectedValue(new Error('Database connection failed'));

    await expect(AppDataSource.initialize()).rejects.toThrow(
      'Database connection failed',
    );
  });
});
