import { Controller, Post, Body, HttpStatus, HttpCode, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * Controller handling authentication-related routes.
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Handles user registration.
   * @param {object} body - Request body containing email, password, and role.
   * @returns {Promise<object>} - Response containing the created user details.
   */
  @Post('register')
  async register(@Body() body) {
    return this.authService.register(body.email, body.password, body.role);
  }

  /**
   * Handles user login.
   * @param {object} body - Request body containing email and password.
   * @returns {Promise<object>} - Response containing the authentication token.
   */
  @Post('login')
  async login(@Body() body) {
    return this.authService.login(body.email, body.password);
  }

  /**
   * Handles user logout.
   * Note: In JWT-based authentication, logout is typically managed on the client-side by removing the token.
   * @param {Request} req - HTTP request object.
   * @returns {object} - Response message confirming logout.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    return { message: 'Logout successful' };
  }
}
