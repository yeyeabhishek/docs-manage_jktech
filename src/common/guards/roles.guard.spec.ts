import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from './roles.guard';
import { CustomRequest } from '../../auth/custom-request.interface';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;
  let jwtService: JwtService;
  let mockContext: Partial<ExecutionContext>;

  beforeEach(() => {
    reflector = new Reflector();
    jwtService = new JwtService({ secret: 'test-secret' });
    rolesGuard = new RolesGuard(reflector, jwtService);

    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(),
      }),
      getHandler: jest.fn().mockReturnValue(() => {}), // Mock getHandler
    };
  });

  it('should allow access if no roles are required', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);

    expect(rolesGuard.canActivate(mockContext as ExecutionContext)).toBe(true);
  });

  it('should throw ForbiddenException if no token is provided', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    (mockContext.switchToHttp as jest.Mock).mockReturnValue({
      getRequest: jest.fn().mockReturnValue({ headers: {} }),
    });

    expect(() =>
      rolesGuard.canActivate(mockContext as ExecutionContext),
    ).toThrow(new ForbiddenException('No token provided'));
  });

  it('should throw ForbiddenException if token is invalid', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    (mockContext.switchToHttp as jest.Mock).mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'Bearer invalid_token' },
      }),
    });

    expect(() =>
      rolesGuard.canActivate(mockContext as ExecutionContext),
    ).toThrow(new ForbiddenException('Invalid token'));
  });

  it('should allow access if user has the required role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    jest.spyOn(jwtService, 'verify').mockReturnValue({ roles: ['admin'] });

    (mockContext.switchToHttp as jest.Mock).mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'Bearer valid_token' },
        user: { roles: ['admin'] },
      }),
    });

    expect(rolesGuard.canActivate(mockContext as ExecutionContext)).toBe(true);
  });

  it('should deny access if user does not have the required role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    jest.spyOn(jwtService, 'verify').mockReturnValue({ roles: ['user'] });

    (mockContext.switchToHttp as jest.Mock).mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'Bearer valid_token' },
        user: { roles: ['user'] },
      }),
    });

    expect(rolesGuard.canActivate(mockContext as ExecutionContext)).toBe(false);
  });
});
