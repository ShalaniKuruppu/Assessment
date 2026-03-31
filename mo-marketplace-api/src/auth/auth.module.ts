import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'mysecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService ,JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
