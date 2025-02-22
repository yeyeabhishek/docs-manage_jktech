// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Document } from './document.entity';

// @Injectable()
// export class DocumentService {
//   constructor(
//     @InjectRepository(Document)
//     private documentRepository: Repository<Document>,
//   ) {}

//   async saveFileMetadata(fileName: string, fileUrl: string, uploadedBy: string) {
//     console.log("Saving file metadata:", { fileName, fileUrl, uploadedBy });

//     const newDocument = this.documentRepository.create({
//       fileName,
//       fileUrl,
//       uploadedBy: { id: uploadedBy }, // ✅ Fix: Pass an object with ID
//     });

//     return this.documentRepository.save(newDocument);
//   }
// }


// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Document } from './document.entity';

// @Injectable()
// export class DocumentService {
//   constructor(
//     @InjectRepository(Document) // ✅ Inject Repository
//     private readonly documentRepository: Repository<Document>,
//   ) {}

//   async saveFileMetadata(filename: string, fileUrl: string, uploadedBy: string) {
//     const document = this.documentRepository.create({ filename, fileUrl, uploadedBy });
//     return this.documentRepository.save(document);
//   }
// }
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

    private readonly documentsService: DocumentsService // ✅ Injecting DocumentsService
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

    await this.documentRepository.save(document); // ✅ Save metadata to DB

    await this.documentsService.deleteFileFromS3(fileKey); // ✅ Corrected service call
  }
}





//=====================

// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Document } from './document.entity';

// @Injectable()
// export class DocumentService {
//   constructor(
//     @InjectRepository(Document)
//     private documentRepository: Repository<Document>,
//   ) {}

//   async saveFileMetadata(fileName: string, fileUrl: string, uploadedBy: string) {
//     console.log("===========fileName==============",fileName)
//     console.log("===========fileUrl==============",fileUrl)
//     console.log("===========uploadedBy==============",uploadedBy)

//     const newDocument = this.documentRepository.create({
//       fileName,
//       fileUrl,
//       uploadedBy: { id: uploadedBy }, // Fix: Pass an object with ID for relation
//     });
//     const result = await this.documentRepository.save(newDocument);
//     console.log("==========saveFileMetadata==============",result)
//     return result
//   }
// }


