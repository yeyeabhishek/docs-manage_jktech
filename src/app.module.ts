import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/S3Service/documents.module';
import { User } from './users/user.entity';
import { Role } from './roles/role.entity';
import { Document } from './documents/document.entity';
import { IngestionProcess } from './ingestion/ingestion.entity';
import { RoleModule } from './roles/role.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * The root module of the application.
 * It imports and configures all necessary modules and dependencies.
 */
@Module({
  controllers: [AppController],
  providers: [AppService],  // <--- Add this
  imports: [
    /**
     * ConfigModule: Loads environment variables globally.
     * Ensures that configuration settings are accessible throughout the application.
     */
    ConfigModule.forRoot({ isGlobal: true }),

    /**
     * TypeOrmModule: Configures database connection settings.
     * Uses PostgreSQL as the database engine.
     */
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'abhishek123',
      database: process.env.DB_NAME || 'docs_manage_jktech',
      entities: [User, Role, Document, IngestionProcess], // Entities that will be managed by TypeORM.
      synchronize: true, 
      autoLoadEntities: true, 
    }),

    /**
     * Authentication Module: Handles user authentication and authorization.
     */
    AuthModule,

    /**
     * Documents Module: Manages document-related operations.
     */
    DocumentsModule,

    /**
     * Role Module: Handles user roles and permissions.
     */
    RoleModule,
  ],
})
export class AppModule {}
