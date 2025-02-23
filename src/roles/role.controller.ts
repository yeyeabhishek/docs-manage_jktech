import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleService } from './role.service';

/**
 * Controller responsible for handling role-related operations.
 */
@Controller('roles')
export class RoleController {
  /**
   * Constructor to inject RoleService for role management operations.
   * @param roleService - The service handling role-related logic.
   */
  constructor(private readonly roleService: RoleService) {}

  /**
   * Creates a new role.
   * @param name - The name of the role to be created.
   * @returns The created role.
   */
  @Post()
  async createRole(@Body('name') name: string) {
    return this.roleService.createRole(name);
  }

  /**
   * Retrieves all roles.
   * @returns A list of all roles.
   */
  @Get()
  async getAllRoles() {
    return this.roleService.getAllRoles();
  }
}
