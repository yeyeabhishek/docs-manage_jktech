import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { Repository } from 'typeorm';
import { User, UserRole } from '../user.entity';
import { Role } from '../../roles/role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const mockUser: User = {
        id: '1',
        email,
        passwordHash: 'hashedPassword',
        roles: [],
        createdAt: undefined,
        documents: undefined,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await userService.findByEmail(email);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email },
        relations: ['roles'],
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const result = await userService.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'user1@example.com',
          passwordHash: 'hash1',
          roles: [],
          createdAt: undefined,
          documents: undefined,
        },
        {
          id: '2',
          email: 'user2@example.com',
          passwordHash: 'hash2',
          roles: [],
          createdAt: undefined,
          documents: undefined,
        },
      ];

      jest.spyOn(userRepository, 'find').mockResolvedValue(mockUsers);

      const result = await userService.findAllUsers();

      expect(userRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const email = 'newuser@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedPassword123';

      const mockUser: User = {
        id: '1', // Ensure `id` is present
        email: 'newuser@example.com',
        passwordHash: 'hashedPassword123',
        createdAt: new Date(),
        roles: [],
        documents: [],
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await userService.createUser(
        email,
        password,
        UserRole.USER,
      );

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email,
          passwordHash: hashedPassword,
          roles: [],
        }),
      );
      expect(result.email).toEqual(email);
      expect(result.passwordHash).toEqual(hashedPassword);
    });
  });

  describe('updateUserRole', () => {
    it('should update the user role and return the updated user', async () => {
      const userId = '1';
      const roleName = 'Admin';
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
        createdAt: new Date(),
        roles: [],
        documents: [],
      };

      const mockRole: Role = { id: 1, name: roleName, users: [] };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(mockRole);

      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await userService.updateUserRole(userId, roleName);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['roles'],
      });
      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { name: roleName },
      });
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ roles: [mockRole] }),
      );
      expect(result.roles).toEqual([mockRole]);
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        userService.updateUserRole('999', 'Admin'),
      ).rejects.toThrowError('User not found');
    });

    it('should throw an error if role is not found', async () => {
      const userId = '1';
      const roleName = 'NonExistentRole';
      const mockUser: User = {
        id: userId,
        email: 'user@example.com',
        passwordHash: 'hash',
        roles: [],
        createdAt: undefined,
        documents: undefined,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null);

      await expect(
        userService.updateUserRole(userId, roleName),
      ).rejects.toThrowError('Role not found');
    });
  });
});
