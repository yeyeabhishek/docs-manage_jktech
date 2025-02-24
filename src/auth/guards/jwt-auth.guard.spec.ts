import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;
  let mockContext: Partial<ExecutionContext>;

  beforeEach(() => {
    jwtService = new JwtService({});
    reflector = new Reflector();
    jwtAuthGuard = new JwtAuthGuard(jwtService, reflector);

    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(),
      }),
    };
  });

  it('should return true when a valid token is provided', () => {
    const mockToken = 'valid.token.here';
    const mockDecodedUser = { id: 1, email: 'test@example.com' };

    jest.spyOn(jwtService, 'verify').mockReturnValue(mockDecodedUser);

    const mockRequest = { headers: { authorization: `Bearer ${mockToken}` }, user: null };
    (mockContext.switchToHttp as jest.Mock).mockReturnValue({ getRequest: () => mockRequest });

    const result = jwtAuthGuard.canActivate(mockContext as ExecutionContext);
    expect(result).toBe(true);
    expect(mockRequest.user).toEqual(mockDecodedUser);
  });

  it('should return false when no token is provided', () => {
    const mockRequest = { headers: {} };
    (mockContext.switchToHttp as jest.Mock).mockReturnValue({ getRequest: () => mockRequest });

    const result = jwtAuthGuard.canActivate(mockContext as ExecutionContext);
    expect(result).toBe(false);
  });

  it('should return false when an invalid token is provided', () => {
    const mockToken = 'invalid.token.here';

    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const mockRequest = { headers: { authorization: `Bearer ${mockToken}` }, user: null };
    (mockContext.switchToHttp as jest.Mock).mockReturnValue({ getRequest: () => mockRequest });

    const result = jwtAuthGuard.canActivate(mockContext as ExecutionContext);
    expect(result).toBe(false);
  });
});
