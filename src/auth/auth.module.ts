import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from '../users/user.module';

/**
 * Authentication Module
 * ----------------------
 * This module handles authentication, including user login, registration, 
 * and JWT-based authorization.
 */
@Module({
  imports: [
    /**
     * TypeORM Module:
     * Registers the User and Role entities for database operations.
     */
    TypeOrmModule.forFeature([User, Role]),

    /**
     * User Module:
     * Uses forwardRef to resolve circular dependencies between UserModule and AuthModule.
     */
    forwardRef(() => UserModule),

    /**
     * JWT Module:
     * Configures JWT with a secret key and an expiration time.
     */
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey', // Secret key for signing JWTs
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
  ],
  
  /**
   * Providers:
   * Includes AuthService and JwtStrategy for handling authentication logic.
   */
  providers: [AuthService, JwtStrategy],

  /**
   * Exports:
   * AuthService and JwtModule are exported for use in other modules.
   */
  exports: [AuthService, JwtModule],

  /**
   * Controllers:
   * Registers the AuthController to handle authentication-related routes.
   */
  controllers: [AuthController],
})
export class AuthModule {}
