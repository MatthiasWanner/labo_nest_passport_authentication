import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ACCES_TOKEN } from 'src/constants';
import { AuthService } from '../auth.service';
import { RegisterUserInput } from '../dtos/register-user.input';
import { GoogleOauthGuard } from '../guards/google-oauth.guard';

@Controller('auth')
export class GoogleAuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google/login')
  @UseGuards(GoogleOauthGuard)
  async googleLogin() {
    // This handler is just used to activate AuthGuard and request Google page
  }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.signIn(req.user as RegisterUserInput);

    res.cookie(ACCES_TOKEN, token, {
      maxAge: 3_600_000,
      sameSite: true,
      secure: false,
      httpOnly: true,
      domain: this.configService.get('WEB_APP_DOMAIN'),
    });

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
