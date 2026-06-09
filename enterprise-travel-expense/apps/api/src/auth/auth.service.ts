import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // Mocking SSO login flow
  async ssoLogin(email: string) {
    const user = await this.usersService.findOrCreateMockUser(email);
    const payload = { sub: user._id, email: user.email, role: user.role };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }
}
