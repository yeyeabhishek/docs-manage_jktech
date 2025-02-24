import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../user.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    findByEmail: jest.fn(),
    findAllUsers: jest.fn(),
    updateUserRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({})
      .overrideGuard(RolesGuard)
      .useValue({})
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser = { id: '1', email: 'test@example.com', roles: [] };
      mockUserService.findByEmail.mockResolvedValue(mockUser);

      const result = await userController.getUserByEmail('test@example.com');

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@example.com', roles: [] },
        { id: '2', email: 'user2@example.com', roles: [] },
      ];
      mockUserService.findAllUsers.mockResolvedValue(mockUsers);

      const result = await userController.getAllUsers();

      expect(mockUserService.findAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('updateUserRole', () => {
    it('should update a user role', async () => {
      const userId = '1';
      const roleName = UserRole.ADMIN;
      const updatedUser = {
        id: userId,
        email: 'user@example.com',
        roles: [{ name: roleName }],
      };

      mockUserService.updateUserRole.mockResolvedValue(updatedUser);

      const result = await userController.updateUserRole(userId, { roleName });

      expect(mockUserService.updateUserRole).toHaveBeenCalledWith(
        userId,
        roleName,
      );
      expect(result).toEqual(updatedUser);
    });
  });
});
