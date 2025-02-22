// import { Module } from '@nestjs/common';
// import { DocumentsService } from './documents.service';
// import { DocumentsController } from './documents.controller';
// import { Document } from './document.entity';

// //=============================



// import { JwtModule } from '@nestjs/jwt';  // Import JwtModule
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Ensure this path is correct
// import { AuthModule } from '../auth/auth.module'; // Ensure this module provides JwtService

// @Module({
//   imports: [
//     AuthModule,  // Import AuthModule if it provides JwtService
//     JwtModule.register({
//       secret: process.env.JWT_SECRET || 'yourSecretKey', // Ensure secret is set
//       signOptions: { expiresIn: '1h' },
//     }),
//   ],
//   providers: [DocumentsService, JwtAuthGuard],
//   controllers: [DocumentsController],
//   exports: [DocumentsService],
// })
// export class DocumentsModule {}



// import { Document } from './document.entity';






// @Module({
//   providers: [DocumentsService],
//   controllers: [DocumentsController]
// })
// export class DocumentsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { DocumentService } from './document.service';
import { DocumentsController } from './documents.controller';
import { Document } from './document.entity'; // Import entity
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/user.entity'; // Import User entity


@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Document ,User]), // ✅ Register Document entity
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



