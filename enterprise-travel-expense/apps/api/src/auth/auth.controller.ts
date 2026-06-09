import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  ssoLogin(@Body() loginDto: Record<string, any>) {
    // In a real SSO, we would receive an assertion/token. Here we mock it by receiving an email.
    const email = loginDto.email || 'demo@enterprise.com';
    return this.authService.ssoLogin(email);
  }
}
