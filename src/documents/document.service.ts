import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { User } from '../users/user.entity';
import { DocumentsService } from './documents.service';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>, 

    private readonly documentsService: DocumentsService
  ) {}

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

    await this.documentsService.deleteFileFromS3(fileKey); 
  }

  async deleteDocument(documentId: string): Promise<boolean> {
    const deleteResult = await this.documentRepository.delete(documentId);
    return deleteResult.affected > 0; 
  }
  async getAllDocuments(): Promise<Document[]> {
    return await this.documentRepository.find();
  }
}


