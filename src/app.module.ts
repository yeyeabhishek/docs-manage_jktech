import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
///documents/documents.module
import { User } from './users/user.entity';
import { Role } from './roles/role.entity';
//./users/role.entity
import { Document } from './documents/document.entity';
///documents/document.entity
import { IngestionProcess } from './ingestion/ingestion.entity';
import { RoleModule } from './roles/role.module'; // Import RoleModule
// /ingestion/ingestion.entity


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'abhishek123',
      database: process.env.DB_NAME || 'docs_manage_jktech',
      entities: [User, Role, Document, IngestionProcess],
      synchronize: true, // Set to false in production
      autoLoadEntities: true,
    }),    
    AuthModule,
    DocumentsModule,
    RoleModule,
  ],
})
export class AppModule {}


