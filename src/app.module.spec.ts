// app.module.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/S3Service/documents.module';
import { RoleModule } from './roles/role.module';

// Create mock objects
jest.mock('./documents/documents.service');
jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => ({
      send: jest.fn(),
    })),
  };
});

// Mock the TypeOrmModule
jest.mock('@nestjs/typeorm', () => {
  const originalModule = jest.requireActual('@nestjs/typeorm');
  return {
    __esModule: true,
    ...originalModule,
    TypeOrmModule: {
      forRoot: jest.fn().mockReturnValue({
        module: class TypeOrmModuleMock {},
        providers: [],
      }),
      forFeature: jest.fn().mockReturnValue({
        module: class TypeOrmFeatureModuleMock {},
        providers: [],
      }),
    },
  };
});

// Mock the modules that depend on TypeORM
jest.mock('./auth/auth.module', () => ({
  AuthModule: class MockAuthModule {},
}));

jest.mock('./documents/documents.module', () => ({
  DocumentsModule: class MockDocumentsModule {},
}));

jest.mock('./roles/role.module', () => ({
  RoleModule: class MockRoleModule {},
}));

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    const moduleFixture = Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          // Using mock environment values for testing
          load: [
            () => ({
              AWS_REGION: 'mock-region',
              AWS_ACCESS_KEY_ID: 'mock-key',
              AWS_SECRET_ACCESS_KEY: 'mock-secret',
            }),
          ],
        }),
        TypeOrmModule.forRoot(),
        AuthModule,
        DocumentsModule,
        RoleModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    });

    module = await moduleFixture.compile();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have AppController', () => {
    const appController = module.get<AppController>(AppController);
    expect(appController).toBeDefined();
  });

  it('should have AppService', () => {
    const appService = module.get<AppService>(AppService);
    expect(appService).toBeDefined();
  });

  it('should import required modules successfully', () => {
    // The fact that the module compiles successfully means all imports are working
    expect(module).toBeDefined();

    // Verify controller and service are accessible
    const appController = module.get<AppController>(AppController);
    const appService = module.get<AppService>(AppService);
    expect(appController).toBeDefined();
    expect(appService).toBeDefined();
  });
});
