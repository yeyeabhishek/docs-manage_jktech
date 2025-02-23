import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard'; 
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './user.entity'; 


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }
  @Get()
  @UseGuards(AuthGuard, RolesGuard) 
  @Roles(UserRole.ADMIN) 
  async getAllUsers() {
    console.log("=========admin abhi===========")
    return this.userService.findAllUsers();
  }

  @UseGuards(AuthGuard, RolesGuard)  
  @Roles('admin')  
  @Put(':id/role')
  async updateUserRole(@Param('id') userId: string, @Body() body) {
    console.log("===========updateUserRole===========")
    return this.userService.updateUserRole(userId, body.roleName); 
  }
  
}
