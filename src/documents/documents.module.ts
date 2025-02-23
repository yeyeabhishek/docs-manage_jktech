import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { DocumentService } from './document.service';
import { DocumentsController } from './documents.controller';
import { Document } from './document.entity'; 
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/user.entity'; 

/**
 * Module responsible for handling document-related functionality.
 */
@Module({
  imports: [
    /**
     * Authentication module to enable JWT-based authentication.
     */
    AuthModule,

    /**
     * TypeORM module to integrate the Document and User entities with the database.
     */
    TypeOrmModule.forFeature([Document, User]), 

    /**
     * JWT module for handling authentication tokens.
     */
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  /**
   * Providers responsible for business logic related to documents.
   */
  providers: [DocumentsService, DocumentService, JwtAuthGuard],

  /**
   * Controllers that handle HTTP requests related to documents.
   */
  controllers: [DocumentsController],

  /**
   * Exports the services to make them available for use in other modules.
   */
  exports: [DocumentsService, DocumentService],
})
export class DocumentsModule {}
