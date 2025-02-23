import { 
  Controller, 
  Post, 
  UploadedFile, 
  UseInterceptors, 
  Get, 
  UseGuards, 
  Body, 
  Request, 
  Delete, 
  Param, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { DocumentService } from './document.service'; 
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

/**
 * Controller responsible for handling document-related HTTP requests.
 */
@Controller('documents')
export class DocumentsController {
  constructor(
    /**
     * Service for handling document-related external operations.
     */
    private readonly documentsService: DocumentsService,

    /**
     * Service for handling document database operations.
     */
    private readonly documentService: DocumentService, 
    
    /**
     * Repository for interacting with the User entity.
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, 
  ) {}
  
  /**
   * Uploads a file, saves its metadata, and stores it in S3.
   * This route is protected and requires authentication.
   *
   * @param file - The uploaded file.
   * @param uploadedBy - The email of the user who uploaded the file.
   * @param req - The HTTP request object.
   * @returns A success message and the file URL.
   * @throws HttpException if the user is not found.
   */
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('uploadedBy') uploadedBy: string, @Request() req) {
    // Find user by email
    const userEmail = await this.userRepository.findOne({ where: { email: uploadedBy } });
    console.log("==========userEmail=========", userEmail);
    
    // Upload file to S3
    const uploadResult = await this.documentsService.uploadFile(file);
    const fileKey = uploadResult.Key; 
   
    // Save file metadata in the database
    await this.documentService.saveFileMetadata(file.originalname, uploadResult.Location, fileKey, uploadedBy);

    return { message: 'File uploaded and saved successfully', fileUrl: uploadResult.Location };
  }

  /**
   * Deletes a document by its ID.
   *
   * @param documentId - The ID of the document to delete.
   * @returns A success message if deletion is successful.
   * @throws HttpException if the document is not found.
   */
  @Delete(':id')
  async deleteDocument(@Param('id') documentId: string) {
    const result = await this.documentService.deleteDocument(documentId);
    console.log("==========result==============", result);
    
    if (!result) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }

    return { message: 'Document deleted successfully' };
  }

  /**
   * Retrieves all documents from the database.
   *
   * @returns A list of all stored documents.
   */
  @Get()
  async getAllDocuments() {
    console.log("Get All Documents");
    return await this.documentService.getAllDocuments();
  }
}
