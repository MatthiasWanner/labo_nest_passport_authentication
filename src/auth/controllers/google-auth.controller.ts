import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../auth.service';
import { RegisterUserInput } from '../dtos/register-user.input';
import { GoogleOauthGuard } from '../guards/google-oauth.guard';

@Controller('auth')
export class GoogleAuthController {
  constructor(private authService: AuthService) {}

  @Get('google/login')
  @UseGuards(GoogleOauthGuard)
  async googleLogin() {
    // This handler is just used to activate AuthGuard and request Google page
  }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.signIn(req.user as RegisterUserInput);

    res.cookie('access_token', token, {
      maxAge: 3_600_000,
      sameSite: true,
      secure: false,
      httpOnly: true,
    });

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
