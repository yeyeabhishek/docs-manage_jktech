import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './user.entity';

/**
 * Controller for managing user-related operations.
 */
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Retrieves a user by their email.
   * @param email - The email of the user to be retrieved.
   * @returns The user details.
   */
  @Get(':email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  /**
   * Retrieves all users. Only accessible by Admin users.
   * @returns A list of all users.
   */
  @Get()
  @UseGuards(AuthGuard, RolesGuard) // 🛡️ Apply authentication and role-based access control
  @Roles(UserRole.ADMIN) // 🔒 Restrict access to Admin role
  async getAllUsers() {
    console.log('=========admin abhi===========');
    return this.userService.findAllUsers();
  }

  /**
   * Updates the role of a user. Only accessible by Admin users.
   * @param userId - The ID of the user whose role is to be updated.
   * @param body - The request body containing the new role name.
   * @returns The updated user with the new role.
   */
  @UseGuards(AuthGuard, RolesGuard) // 🛡️ Apply authentication and role-based access control
  @Roles('admin') // 🔒 Restrict access to Admin users
  @Put(':id/role')
  async updateUserRole(@Param('id') userId: string, @Body() body) {
    console.log('===========updateUserRole===========');
    return this.userService.updateUserRole(userId, body.roleName);
  }
}
