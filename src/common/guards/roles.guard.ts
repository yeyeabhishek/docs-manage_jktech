import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { CustomRequest } from '../../auth/custom-request.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector, 
    private readonly jwtService: JwtService
  ) {}

  /**
   * Determining whether a request can proceed based on user roles.
   * 
   * @param context - The execution context of the request.
   * @returns A boolean indicating whether the request is authorized.
   * @throws ForbiddenException if no token is provided or the token is invalid.
   */
  canActivate(context: ExecutionContext): boolean {
    // Getting the required roles from the route metadata
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    // Extracting request object
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const authHeader = request.headers.authorization;

    // Checking if authorization header is provided
    if (!authHeader) {
      throw new ForbiddenException('No token provided');
    }

    try {
      // Extracting and verify the JWT token
      const token = authHeader.split(' ')[1];
      const decoded = this.jwtService.verify(token);
      request.user = decoded; 

      // Checking if the user's roles match the required roles
      return requiredRoles.some(role => decoded.roles.includes(role));
    } catch (error) {
      throw new ForbiddenException('Invalid token');
    }
  }
}
