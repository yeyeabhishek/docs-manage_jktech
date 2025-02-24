import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { AuthGuard } from './auth.guard';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let mockContext: Partial<ExecutionContext>;

  beforeEach(() => {
    authGuard = new AuthGuard(new Reflector());
    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(),
      }),
    };
  
    // Mock console.error to suppress error logs in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    // Restore console.error after each test
    jest.restoreAllMocks();
  });
  
  it('should return true when a valid token is provided', () => {
    const mockToken = 'valid-token';
    const mockUser = { id: 1, email: 'test@example.com' };
    
    (jwt.verify as jest.Mock).mockReturnValue(mockUser);

    const request = { headers: { authorization: `Bearer ${mockToken}` }, user: null };
    (mockContext.switchToHttp as jest.Mock).mockReturnValue({ getRequest: () => request });

    expect(authGuard.canActivate(mockContext as ExecutionContext)).toBe(true);
    expect(request.user).toEqual(mockUser);
  });

  it('should throw UnauthorizedException if no token is provided', () => {
    const request = { headers: {} };
    (mockContext.switchToHttp as jest.Mock).mockReturnValue({ getRequest: () => request });

    expect(() => authGuard.canActivate(mockContext as ExecutionContext))
      .toThrow(new UnauthorizedException('No token provided'));
  });

  it('should throw UnauthorizedException if the token is invalid', () => {
    const mockToken = 'invalid-token';
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const request = { headers: { authorization: `Bearer ${mockToken}` } };
    (mockContext.switchToHttp as jest.Mock).mockReturnValue({ getRequest: () => request });

    expect(() => authGuard.canActivate(mockContext as ExecutionContext))
      .toThrow(new UnauthorizedException('Invalid or expired token'));
  });
});
