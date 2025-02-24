import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret'; 
    jwtStrategy = new JwtStrategy();
  });

  it('should validate the payload successfully', async () => {
    const mockPayload = { userId: 1, email: 'test@example.com' };

    const result = await jwtStrategy.validate(mockPayload);

    expect(result).toEqual(mockPayload);
  });

  it('should throw UnauthorizedException if payload is missing', async () => {
    await expect(jwtStrategy.validate(null)).rejects.toThrow(UnauthorizedException);
  });
});
