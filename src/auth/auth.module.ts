import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import AuthControllers from './controllers';
import { AuthService } from './auth.service';
import AuthStrategies from './strategies';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get('ACCESS_TOKEN_EXPIRATION'),
        },
      }),
    }),
  ],
  controllers: [...AuthControllers],
  providers: [AuthService, ...AuthStrategies],
})
export class AuthModule {}
