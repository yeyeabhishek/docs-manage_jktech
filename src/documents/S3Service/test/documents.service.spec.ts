import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from '../documents.service';
import { S3 } from 'aws-sdk';


process.env.AWS_S3_BUCKET = 'test-bucket';
process.env.AWS_REGION = 'us-east-1';
process.env.AWS_ACCESS_KEY_ID = 'test-access-key';
process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key';


jest.mock('aws-sdk', () => {
  const mS3 = {
    upload: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Location: 'https://s3-bucket-url/file.pdf' }),
    }),
    deleteObject: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    }),
  };

  return {
    S3: jest.fn(() => mS3),
  };
});



describe('DocumentsService', () => {
  let documentsService: DocumentsService;
  let s3: jest.Mocked<S3>;

  beforeEach(async () => {
    s3 = new S3() as jest.Mocked<S3>; // Ensure mocked instance is used

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: S3, useValue: s3 }, // Inject the mocked S3 instance
      ],
    }).compile();

    documentsService = module.get<DocumentsService>(DocumentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('should upload a file to S3 and return the file URL', async () => {
      const mockFile = {
        originalname: 'test.pdf',
        buffer: Buffer.from('test file data'),
      } as Express.Multer.File;

      const result = await documentsService.uploadFile(mockFile);

      expect(s3.upload).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ Location: 'https://s3-bucket-url/file.pdf' });
    });
  });

  describe('deleteFileFromS3', () => {
    it('should delete a file from S3', async () => {
      const fileKey = 'documents/test.pdf';

      await documentsService.deleteFileFromS3(fileKey);

      expect(s3.deleteObject).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if deletion fails', async () => {
      const fileKey = 'documents/test.pdf';

      s3.deleteObject.mockReturnValueOnce({
        promise: jest.fn().mockRejectedValue(new Error('S3 Deletion Error')),
      } as any);

      await expect(documentsService.deleteFileFromS3(fileKey)).rejects.toThrow('Failed to delete file from S3');
    });
  });
});
