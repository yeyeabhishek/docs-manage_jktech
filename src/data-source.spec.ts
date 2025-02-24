import { DataSource } from 'typeorm';

describe('AppDataSource', () => {
  let testDataSource: DataSource;

  beforeAll(() => {
    // Mock environment variables
    process.env.DB_HOST = 'test_host';
    process.env.DB_PORT = '5433';
    process.env.DB_USERNAME = 'test_user';
    process.env.DB_PASSWORD = 'test_password';
    process.env.DB_NAME = 'test_db';

    // Create a new instance of DataSource with the test environment variables
    testDataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      migrations: ['dist/migrations/*.js'],
      entities: ['dist/**/*.entity.js'],
      logging: true,
    });
  });

  it('should create a DataSource instance', () => {
    expect(testDataSource).toBeInstanceOf(DataSource);
  });

  it('should have correct database configuration', () => {
    expect(testDataSource.options).toEqual(
      expect.objectContaining({
        type: 'postgres',
        host: 'test_host',
        port: 5433,
        username: 'test_user',
        password: 'test_password',
        database: 'test_db',
        synchronize: false,
        logging: true,
      }),
    );
  });

  it('should contain the correct migrations and entities path', () => {
    expect(testDataSource.options.migrations).toContain('dist/migrations/*.js');
    expect(testDataSource.options.entities).toContain('dist/**/*.entity.js');
  });
});
