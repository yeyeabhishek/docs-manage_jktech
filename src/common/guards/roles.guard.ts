import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { CustomRequest } from '../../auth/custom-request.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<CustomRequest>();
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new ForbiddenException('No token provided');

    try {
      const token = authHeader.split(' ')[1];
      const decoded = this.jwtService.verify(token);
      request.user = decoded; 

      return requiredRoles.some(role => decoded.roles.includes(role));
    } catch (error) {
      throw new ForbiddenException('Invalid token');
    }
  }
}
