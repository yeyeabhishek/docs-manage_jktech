import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

describe('Main Bootstrap Function', () => {
  let mockApp: { listen: jest.Mock };

  beforeEach(() => {
    mockApp = { listen: jest.fn() };
    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
  });

  it('should create a Nest application and start listening on port 3000', async () => {
    await import('./main');

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(mockApp.listen).toHaveBeenCalledWith(3000);
  });
});
