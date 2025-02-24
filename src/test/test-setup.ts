// import { INestApplication } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { AppModule } from '../app.module';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Document } from '../documents/document.entity';
// import { Repository } from 'typeorm';

// // Mock repository
// const mockRepository = {
//   find: jest.fn(() => Promise.resolve([{ id: 1, title: 'Test Doc' }])),
//   save: jest.fn((doc) => Promise.resolve({ id: 1, ...doc })),
// };

// export async function createTestApp(): Promise<INestApplication> {
//   const moduleFixture: TestingModule = await Test.createTestingModule({
//     imports: [AppModule],
//   })
//     .overrideProvider(getRepositoryToken(Document))
//     .useValue(mockRepository) // Replace database calls with mock
//     .compile();

//   const app = moduleFixture.createNestApplication();
//   await app.init();
//   return app;
// }
