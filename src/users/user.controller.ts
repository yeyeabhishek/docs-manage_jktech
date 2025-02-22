import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard'; // Ensure authentication
import { RolesGuard } from '../auth/roles.guard'; // Ensure only admins can access
import { Roles } from '../auth/roles.decorator';///auth/roles.decorator
import { UserRole } from './user.entity'; 


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard) // Protect this route
  @Roles(UserRole.ADMIN) // Only Admins can get all users
  async getAllUsers() {
    console.log("=========admin abhi===========")
    return this.userService.findAllUsers();
  }
  async assignRole(
    // @Param('userId') userId: string,
    @Param('roleName') roleName: string,
  ) {
    return this.userService.assignRoleToUser(roleName);
  }
  
}
