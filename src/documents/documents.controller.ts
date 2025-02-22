// import { Controller, Post, UploadedFile, UseInterceptors,Get, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// import { FileInterceptor } from '@nestjs/platform-express';
// import { DocumentsService } from './documents.service';

// @Controller('documents')
// export class DocumentsController {
//   constructor(private documentsService: DocumentsService) {}

//   @Get()
//   @UseGuards(JwtAuthGuard)
//   findAll() {
//     return 'Protected Route!';
//   }

//   @Post('upload')
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadFile(@UploadedFile() file: Express.Multer.File) {
//     return this.documentsService.uploadFile(file);
//   }
// }



import { Controller, Post, UploadedFile, UseInterceptors, Get, UseGuards, Body, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { DocumentService } from './document.service'; // Import DocumentService
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly documentService: DocumentService, // Inject DocumentService
    

    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // ✅ Inject User repository


    
  ) {}
  
 
  @Get()
  @UseGuards(JwtAuthGuard)
  
  findAll() {
    return 'Protected Route!';
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('uploadedBy') uploadedBy: string,@Request() req ) {
    const userEmail = await this.userRepository.findOne({ where: { email: uploadedBy } });
    
    console.log("==========userEmail=========",userEmail)
    // Upload file to S3
    const uploadResult = await this.documentsService.uploadFile(file);
    const fileKey = uploadResult.Key; // ✅ Get the file key for deletion later
   
    await this.documentService.saveFileMetadata(file.originalname, uploadResult.Location, fileKey, uploadedBy);


    // Save metadata in DB
    return { message: 'File uploaded and saved successfully', fileUrl: uploadResult.Location };
  }
}


// async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
//     const userId = req.user?.id; // Extract user ID from JWT token
//     const userEmail = req.user?.email; // Extract user email from JWT

//     console.log('Authenticated User:', req.user); // Debugging

//     // Upload file to S3
//     const uploadResult = await this.documentsService.uploadFile(file, userId);

//     // Save metadata in DB
//     return this.documentService.saveFileMetadata(
//       file.originalname,
//       uploadResult.Location,
//       userId, // Save authenticated user as `uploadedBy`
//       userEmail,
//     );
//   }







