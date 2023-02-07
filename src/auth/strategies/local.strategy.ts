import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginInput } from '../dtos';
import { IAuthenticatedUser } from '../auth.types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(loginInput: LoginInput): Promise<IAuthenticatedUser> {
    const user = await this.authService.validate(loginInput);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      userId: user.id,
      authProvider: user.provider as IAuthenticatedUser['authProvider'],
      roles: user.roles,
    };
  }
}
