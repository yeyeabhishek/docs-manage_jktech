import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../users/user.service';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../users/user.entity';
import { Role } from '../../roles/role.entity';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

const mockRoleRepository = {
  findOne: jest.fn(),
};

const mockUserService = {
  findByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(() => 'mockToken'),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Role), useValue: mockRoleRepository },
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const role = UserRole.USER;
      const roleEntity = { id: 1, name: role };
      const hashedPassword = 'hashedPassword';
      const user = { email, passwordHash: hashedPassword, roles: [roleEntity] };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      mockRoleRepository.findOne.mockResolvedValue(roleEntity);
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await authService.register(email, password, role);
      expect(result).toEqual(user);
      expect(mockRoleRepository.findOne).toHaveBeenCalledWith({
        where: { name: role },
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email,
        passwordHash: hashedPassword,
        roles: [roleEntity],
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    });

    it('should throw an error if role is not found', async () => {
      mockRoleRepository.findOne.mockResolvedValue(null);

      await expect(
        authService.register('test@example.com', 'password123', UserRole.USER),
      ).rejects.toThrow('Role not found');
    });
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const user = {
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
      };
      mockUserService.findByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.validateUser(
        'test@example.com',
        'password123',
      );
      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.validateUser('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return access token if login is successful', async () => {
      const user: Partial<User> = {
        id: '1',
        email: 'test@example.com',
        roles: [{ name: 'USER' } as Role], 
        passwordHash: 'hashedPassword',
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(user as User); 

      jest.spyOn(jwtService, 'sign').mockReturnValue('mockToken');

      const result = await authService.login('test@example.com', 'password123');

      expect(result).toEqual({ access_token: 'mockToken' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: '1',
        email: 'test@example.com',
        roles: ['USER'],
      });
    });
  });
});
