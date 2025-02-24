import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from '../ingestion.controller';
import { IngestionService } from '../ingestion.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

// Mocking Guards
const mockJwtAuthGuard = {
  canActivate: jest.fn(() => true),
};

const mockRolesGuard = {
  canActivate: jest.fn((context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const userRole = request.user?.role;
    return userRole === 'admin' || userRole === 'editor' || userRole === 'viewer';
  }),
};

// Mocking IngestionService
const mockIngestionService = {
  trigger: jest.fn(async (documentIds: number[]) => ({ message: 'Ingestion triggered', documentIds })),
  getStatus: jest.fn(async () => ({ status: 'running', progress: 50 })),
};

describe('IngestionController', () => {
  let controller: IngestionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [{ provide: IngestionService, useValue: mockIngestionService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<IngestionController>(IngestionController);
  });

  it('should trigger ingestion with valid document IDs', async () => {
    const documentIds = [1, 2, 3];
    const result = await controller.triggerIngestion(documentIds);
    expect(result).toEqual({ message: 'Ingestion triggered', documentIds });
    expect(mockIngestionService.trigger).toHaveBeenCalledWith(documentIds);
  });

  it('should get the ingestion status', async () => {
    const result = await controller.getStatus();
    expect(result).toEqual({ status: 'running', progress: 50 });
    expect(mockIngestionService.getStatus).toHaveBeenCalled();
  });
});
