import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresIn = configService.get<string>('jwt.expiresIn') ?? '1h';

        return {
          secret: configService.get<string>('jwt.secret') ?? 'mysecret',
          signOptions: {
            expiresIn: expiresIn as unknown as number,
          },
        };
      },
    }),
  ],
  providers: [AuthService ,JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
