import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { User } from '../../users/user.entity'; 

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user and return user details', async () => {
      const mockUser: Partial<User> = {
        id: '1',
        email: 'test@example.com',
        roles: [
          {
            id: 1,
            name: 'USER',
            users: [],
          },
        ], // Only include properties that exist in Role
        passwordHash: 'hashedPassword',
        createdAt: new Date(),
        // updatedAt: new Date(),
      };

      jest.spyOn(authService, 'register').mockResolvedValue(mockUser as User);

      const result = await authController.register({
        email: 'test@example.com',
        password: 'password123',
        role: 'USER',
      });

      expect(result).toEqual(mockUser);
      expect(authService.register).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'USER',
      );
    });
  });

  describe('login', () => {
    it('should log in a user and return a token', async () => {
      const mockToken = { access_token: 'mockJwtToken' };

      jest.spyOn(authService, 'login').mockResolvedValue(mockToken);

      const result = await authController.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual(mockToken);
      expect(authService.login).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
    });
  });

  describe('logout', () => {
    it('should return a success message on logout', async () => {
      const result = await authController.logout({});
      expect(result).toEqual({ message: 'Logout successful' });
    });
  });
});
