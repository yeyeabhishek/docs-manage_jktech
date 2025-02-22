import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async createRole(@Body('name') name: string) {
    return this.roleService.createRole(name);
  }


  @Get()
  async getAllRoles() {
    return this.roleService.getAllRoles();
  }
}
