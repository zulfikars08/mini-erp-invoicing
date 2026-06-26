import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const jwtSecret = config.get<string>('JWT_SECRET');

        if (!jwtSecret) {
          throw new Error('JWT_SECRET is not set');
        }

        return {
          secret: jwtSecret,
          signOptions: { expiresIn: (config.get<string>('JWT_EXPIRES_IN') || '1d') as never },
        };
      },
    }),
  ],
  controllers: [AuthController], providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
