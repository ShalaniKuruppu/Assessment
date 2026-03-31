import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: 'mysecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService ,JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
