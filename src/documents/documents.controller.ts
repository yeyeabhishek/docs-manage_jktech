

import { Controller, Post, UploadedFile, UseInterceptors, Get, UseGuards, Body, Request, Delete, Param, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { DocumentService } from './document.service'; 
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly documentService: DocumentService, 
    

    @InjectRepository(User)
    private readonly userRepository: Repository<User>, 


    
  ) {}
  
 
  @UseGuards(JwtAuthGuard)
  
//   findAll() {
//     return 'Protected Route!';
//   }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('uploadedBy') uploadedBy: string,@Request() req ) {
    const userEmail = await this.userRepository.findOne({ where: { email: uploadedBy } });
    
    console.log("==========userEmail=========",userEmail)
    // Upload file to S3
    const uploadResult = await this.documentsService.uploadFile(file);
    const fileKey = uploadResult.Key; 
   
    await this.documentService.saveFileMetadata(file.originalname, uploadResult.Location, fileKey, uploadedBy);


    // Save metadata in DB
    return { message: 'File uploaded and saved successfully', fileUrl: uploadResult.Location };
  }


  @Delete(':id')
  async deleteDocument(@Param('id') documentId: string) {
    const result = await this.documentService.deleteDocument(documentId);
    console.log("==========result==============",result)
    if (!result) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Document deleted successfully' };
  }



  @Get()
  async getAllDocuments() {
    console.log("Get All DOcumetns")
    return await this.documentService.getAllDocuments();
  }



}






