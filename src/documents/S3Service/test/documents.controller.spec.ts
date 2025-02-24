import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from '../documents.controller';
import { DocumentsService } from '../documents.service';
import { DocumentService } from '../../document.service';
import { Repository } from 'typeorm';
import { User } from '../../../users/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
  

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let documentsService: DocumentsService;
  let documentService: DocumentService;
  let userRepository: Repository<User>;

  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: {
            uploadFile: jest.fn(),
          },
        },
        {
          provide: DocumentService,
          useValue: {
            saveFileMetadata: jest.fn(),
            deleteDocument: jest.fn(),
            getAllDocuments: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService, // Mock the JwtService dependency
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-token'),
            verify: jest.fn().mockReturnValue({ userId: 1 }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Override the guard with a mock implementation
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();
  
    controller = module.get<DocumentsController>(DocumentsController);
    documentsService = module.get<DocumentsService>(DocumentsService);
    documentService = module.get<DocumentService>(DocumentService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });
  
  

  describe('uploadFile', () => {
    it('should upload a file and save metadata', async () => {
      const file = { originalname: 'test.pdf' } as Express.Multer.File;
      const uploadedBy = 'test@example.com';
      
      const mockUser: User = {
        id: 1,
        email: uploadedBy,
        createdAt: new Date(),
        roles: [],
        documents: []
      } as unknown as User;
      
      const mockUploadResult = { 
        ETag: 'test-etag', 
        Bucket: 'test-bucket', 
        Key: 'test-key', 
        Location: 'http://s3-url/test.pdf' 
      };
    
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(documentsService, 'uploadFile').mockResolvedValue(mockUploadResult);
      jest.spyOn(documentService, 'saveFileMetadata').mockResolvedValue(undefined);
    
      const result = await controller.uploadFile(file, uploadedBy, {});
    
      expect(result).toEqual({ 
        message: 'File uploaded and saved successfully', 
        fileUrl: mockUploadResult.Location 
      });
    });
    
  });

  describe('deleteDocument', () => {
    it('should delete a document successfully', async () => {
      jest.spyOn(documentService, 'deleteDocument').mockResolvedValue(true);
      
      const result = await controller.deleteDocument('123');
      expect(result).toEqual({ message: 'Document deleted successfully' });
    });

    it('should throw an error if document is not found', async () => {
      jest.spyOn(documentService, 'deleteDocument').mockResolvedValue(false);
      
      await expect(controller.deleteDocument('123')).rejects.toThrow(new HttpException('Document not found', HttpStatus.NOT_FOUND));
    });
  });

  describe('getAllDocuments', () => {
    it('should return all documents', async () => {
      const mockDocuments = [
        { id: '1', name: 'doc1', url: 'http://s3-url/doc1.pdf', uploadedBy: 'user@example.com' },
        { id: '2', name: 'doc2', url: 'http://s3-url/doc2.pdf', uploadedBy: 'user@example.com' }
      ];
  
      jest.spyOn(documentService, 'getAllDocuments').mockResolvedValue(mockDocuments as any);
  
      const result = await controller.getAllDocuments();
      
      expect(result).toEqual(mockDocuments);
      expect(documentService.getAllDocuments).toHaveBeenCalledTimes(1);
    });
  });
  
});
