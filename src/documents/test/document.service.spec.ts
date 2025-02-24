import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from '../document.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from '../document.entity';
import { User } from '../../users/user.entity';
import { DocumentsService } from '../S3Service/documents.service';

describe('DocumentService', () => {
  let documentService: DocumentService;
  let documentRepository: Repository<Document>;
  let userRepository: Repository<User>;
  let documentsService: DocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(Document),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: DocumentsService,
          useValue: {
            deleteFileFromS3: jest.fn(),
          },
        },
      ],
    }).compile();

    documentService = module.get<DocumentService>(DocumentService);
    documentRepository = module.get<Repository<Document>>(
      getRepositoryToken(Document),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    documentsService = module.get<DocumentsService>(DocumentsService);
  });

  it('should save file metadata successfully', async () => {
    const mockUser = { id: 1, email: 'test@example.com' } as unknown as User;
    const mockFile = {
      fileName: 'test.pdf',
      fileUrl: 'http://s3-url.com/test.pdf',
      fileKey: 'test-key',
    };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest
      .spyOn(documentRepository, 'create')
      .mockReturnValue({
        ...mockFile,
        uploadedBy: mockUser,
      } as unknown as Document);
    jest.spyOn(documentRepository, 'save').mockResolvedValue({} as Document);
    jest
      .spyOn(documentsService, 'deleteFileFromS3')
      .mockResolvedValue(undefined);

    await documentService.saveFileMetadata(
      mockFile.fileName,
      mockFile.fileUrl,
      mockFile.fileKey,
      mockUser.email,
    );

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: mockUser.email },
    });
    expect(documentRepository.create).toHaveBeenCalled();
    expect(documentRepository.save).toHaveBeenCalled();
    expect(documentsService.deleteFileFromS3).toHaveBeenCalledWith(
      mockFile.fileKey,
    );
  });

  it('should throw an error if the user is not found when saving metadata', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    await expect(
      documentService.saveFileMetadata(
        'test.pdf',
        'http://s3-url.com/test.pdf',
        'test-key',
        'unknown@example.com',
      ),
    ).rejects.toThrow('User not found');
  });

  it('should delete a document successfully', async () => {
    jest
      .spyOn(documentRepository, 'delete')
      .mockResolvedValue({ affected: 1 } as any);

    const result = await documentService.deleteDocument('1');

    expect(result).toBe(true);
    expect(documentRepository.delete).toHaveBeenCalledWith('1');
  });

  it('should return false if no document is deleted', async () => {
    jest
      .spyOn(documentRepository, 'delete')
      .mockResolvedValue({ affected: 0 } as any);

    const result = await documentService.deleteDocument('1');

    expect(result).toBe(false);
  });

  it('should retrieve all documents successfully', async () => {
    const mockDocuments = [
      { id: 1, fileName: 'file1.pdf', fileUrl: 'http://s3-url.com/file1.pdf' },
      { id: 2, fileName: 'file2.pdf', fileUrl: 'http://s3-url.com/file2.pdf' },
    ] as unknown as Document[];

    jest.spyOn(documentRepository, 'find').mockResolvedValue(mockDocuments);

    const result = await documentService.getAllDocuments();

    expect(result).toEqual(mockDocuments);
    expect(documentRepository.find).toHaveBeenCalled();
  });
});
