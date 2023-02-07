import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ACCES_TOKEN } from 'src/constants';
import { AuthService } from '../auth.service';
import { IAuthenticatedUser, IJWTPayload } from '../auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const extractJwtFromCookie = (req: Request) => {
      return (
        req.cookies?.[ACCES_TOKEN] ??
        ExtractJwt.fromAuthHeaderAsBearerToken()(req)
      );
    };

    super({
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
      jwtFromRequest: extractJwtFromCookie,
    });
  }

  async validate(payload: IJWTPayload): Promise<IAuthenticatedUser> {
    const user = await this.authService.findUserId(payload.userId);

    if (!user) throw new UnauthorizedException('Please log in to continue');

    return user;
  }
}
