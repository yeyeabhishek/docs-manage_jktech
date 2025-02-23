import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Role } from '../roles/role.entity';
import { AuthModule } from '../auth/auth.module';

/**
 * UserModule is responsible for handling user-related functionality.
 */
@Module({
  imports: [
    /**
     * Import TypeORM module with User and Role entities.
     */
    TypeOrmModule.forFeature([User, Role]),

    /**
     * Import AuthModule using forwardRef to handle circular dependencies.
     */
    forwardRef(() => AuthModule),
  ],
  
  /**
   * Service providers for user-related operations.
   */
  providers: [UserService],

  /**
   * Controllers handling incoming requests for user-related operations.
   */
  controllers: [UserController],

  /**
   * Exporting UserService and TypeOrmModule to be used in other modules.
   */
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
