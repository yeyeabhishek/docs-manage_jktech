import { Controller, Post, Body } from '@nestjs/common';
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
}
