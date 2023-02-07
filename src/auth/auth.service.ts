import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { AuthProviders, IAuthenticatedUser, IJWTPayload } from './auth.types';
import { LoginInput, RegisterUserInput } from './dtos';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateJwt(payload: IJWTPayload) {
    return this.jwtService.sign(payload);
  }

  async signIn(user?: RegisterUserInput) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    const userFromDb =
      (await this.findUserByEmail(user.email)) ??
      (await this.registerUser(user));

    return this.generateJwt({
      userId: userFromDb.id,
      authProvider: userFromDb.authProvider,
      roles: userFromDb.roles,
    });
  }

  async registerUser(user: RegisterUserInput) {
    try {
      // TODO: Register user into db

      const newUser = {
        id: randomUUID(),
        roles: ['USER'],
        ...user,
      };

      return newUser;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async findUserByEmail(email: string) {
    console.log('findByEmail', email);

    // TODO: Make real db request
    return null;
  }

  async findUserId(userId: string): Promise<IAuthenticatedUser> {
    console.log('findById', userId);

    // TODO: Make real db request
    return {
      userId,
      authProvider: AuthProviders.GOOGLE,
      roles: ['USER', 'ADMIN'],
    };
  }

  async validate(loginInput: LoginInput) {
    // TODO: Make real db request
    const user = {
      id: randomUUID(),
      email: loginInput.email,
      provider: 'google',
      roles: ['USER', 'ADMIN'],
    };
    console.log('Fake user generated', user);

    return user;
  }
}
