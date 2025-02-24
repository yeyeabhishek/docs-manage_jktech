import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from '../role.service';
import { Repository } from 'typeorm';
import { Role } from '../role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RoleService', () => {
  let roleService: RoleService;
  let roleRepository: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
      ],
    }).compile();

    roleService = module.get<RoleService>(RoleService);
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  describe('createRole', () => {
    it('should create a new role if it does not exist', async () => {
      const roleName = 'Admin';
      const role: Role = { id: 1, name: roleName, users: [] };

      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(roleRepository, 'create').mockReturnValue(role);
      jest.spyOn(roleRepository, 'save').mockResolvedValue(role);

      const result = await roleService.createRole(roleName);

      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { name: roleName },
      });
      expect(roleRepository.create).toHaveBeenCalledWith({ name: roleName });
      expect(roleRepository.save).toHaveBeenCalledWith(role);
      expect(result).toEqual(role);
    });

    it('should throw an error if the role already exists', async () => {
      const roleName = 'Admin';
      const existingRole: Role = { id: 1, name: roleName, users: [] };

      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(existingRole);
      const createSpy = jest.spyOn(roleRepository, 'create');
      const saveSpy = jest.spyOn(roleRepository, 'save');

      await expect(roleService.createRole(roleName)).rejects.toThrowError(
        `Role '${roleName}' already exists.`,
      );

      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { name: roleName },
      });
      expect(createSpy).not.toHaveBeenCalled();
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  describe('getAllRoles', () => {
    it('should return all roles', async () => {
      const roles: Role[] = [
        { id: 1, name: 'Admin', users: [] },
        { id: 2, name: 'User', users: [] },
      ];

      jest.spyOn(roleRepository, 'find').mockResolvedValue(roles);

      const result = await roleService.getAllRoles();

      expect(roleRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(roles);
    });
  });
});
