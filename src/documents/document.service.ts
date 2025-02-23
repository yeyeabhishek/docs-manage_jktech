import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { User } from '../users/user.entity';
import { DocumentsService } from './documents.service';

/**
 * This  Service responsible for handling document-related operations.
 */
@Injectable()
export class DocumentService {
  constructor(
    /**
     * Repository for interacting with the Document entity.
     */
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,

    /**
     * Repository for interacting with the User entity.
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, 

    /**
     * Service for handling document-related utilities and external operations.
     */
    private readonly documentsService: DocumentsService
  ) {}

  /**
   * Saves metadata of an uploaded file in the database.
   * Deletes the file from S3 after storing metadata.
   * 
   * @param fileName - Name of the uploaded file.
   * @param fileUrl - URL where the file is stored.
   * @param fileKey - S3 file key used for deletion.
   * @param uploadedByEmail - Email of the user who uploaded the file.
   * @throws Error if the user is not found.
   */
  async saveFileMetadata(fileName: string, fileUrl: string, fileKey: string, uploadedByEmail: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email: uploadedByEmail } });

    if (!user) {
      throw new Error('User not found');
    }

    const document = this.documentRepository.create({
      fileName,
      fileUrl,
      uploadedBy: { id: user.id },
    });

    await this.documentRepository.save(document); 

    // Delete the file from S3 after saving metadata
    await this.documentsService.deleteFileFromS3(fileKey); 
  }

  /**
   * Deletes a document from the database by its ID.
   * 
   * @param documentId - The ID of the document to be deleted.
   * @returns `true` if the document was deleted successfully, otherwise `false`.
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    const deleteResult = await this.documentRepository.delete(documentId);
    return deleteResult.affected > 0; 
  }

  /**
   * Retrieves all documents from the database.
   * 
   * @returns A list of all documents.
   */
  async getAllDocuments(): Promise<Document[]> {
    return await this.documentRepository.find();
  }
}
