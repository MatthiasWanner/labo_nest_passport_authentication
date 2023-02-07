import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../auth.service';
import { IAuthenticatedUser } from '../auth.types';
import { JwtAuthGuard, LocalAuthGuard } from '../guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const token = this.authService.generateJwt(
        req.user as IAuthenticatedUser,
      );

      res.cookie('access_token', token, {
        maxAge: 3_600_000,
        sameSite: true,
        secure: false,
        httpOnly: true,
      });

      return res.sendStatus(HttpStatus.NO_CONTENT);
    } catch (error) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request) {
    return req.user;
  }
}
