import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from '../role.controller';
import { RoleService } from '../role.service';

describe('RoleController', () => {
  let roleController: RoleController;
  let roleService: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: {
            createRole: jest.fn(),
            getAllRoles: jest.fn(),
          },
        },
      ],
    }).compile();

    roleController = module.get<RoleController>(RoleController);
    roleService = module.get<RoleService>(RoleService);
  });

  describe('createRole', () => {
    it('should create a new role and return it', async () => {
      const roleName = 'Admin';
      const expectedResult = {
        id: 1,
        name: roleName,
        users: [],
      };

      jest.spyOn(roleService, 'createRole').mockResolvedValue(expectedResult);

      const result = await roleController.createRole(roleName);

      expect(roleService.createRole).toHaveBeenCalledWith(roleName);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAllRoles', () => {
    it('should return an array of roles', async () => {
      const expectedRoles = [
        { id: 1, name: 'Admin', users: [] },
        { id: 2, name: 'User', users: [] },
      ];

      jest.spyOn(roleService, 'getAllRoles').mockResolvedValue(expectedRoles);

      const result = await roleController.getAllRoles();

      expect(roleService.getAllRoles).toHaveBeenCalled();
      expect(result).toEqual(expectedRoles);
    });
  });
});
