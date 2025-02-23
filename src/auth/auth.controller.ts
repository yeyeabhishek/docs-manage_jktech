import { Controller, Post, Body, HttpStatus, HttpCode, Request,  } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body) {
    return this.authService.register(body.email, body.password, body.role);
  }

  @Post('login')
  login(@Body() body) {
    return this.authService.login(body.email, body.password);
  }

  
    @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    // In JWT, logout is typically handled client-side by removing the token
    return { message: 'Logout successful' };
  }
}
