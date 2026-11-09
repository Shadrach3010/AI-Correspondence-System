import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const passwordHash = await this.authService.hashPassword(body.password);

    return {
      accessToken: await this.authService.signToken({
        email: body.email,
        sub: 'demo-user-id',
      }),
      tokenType: 'Bearer',
      user: {
        email: body.email,
        passwordHash,
      },
    };
  }
}
