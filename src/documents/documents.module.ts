import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { DocumentService } from './document.service';
import { DocumentsController } from './documents.controller';
import { Document } from './document.entity'; 
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/user.entity'; 


@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Document ,User]), 
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [DocumentsService, DocumentService, JwtAuthGuard],
  controllers: [DocumentsController],
  exports: [DocumentsService, DocumentService],
})
export class DocumentsModule {}



