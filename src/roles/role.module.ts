import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

/**
 * Module for managing roles in the system.
 * It provides functionalities to create, retrieve, and manage roles.
 */
@Module({
  /**
   * Importing TypeORM module for Role entity.
   */
  imports: [TypeOrmModule.forFeature([Role])],

  /**
   * Providers for the Role module.
   * RoleService handles all business logic related to roles.
   */
  providers: [RoleService],

  /**
   * Controllers to handle HTTP requests related to roles.
   */
  controllers: [RoleController],

  /**
   * Exporting RoleService to be used in other modules.
   */
  exports: [RoleService],
})
export class RoleModule {}
