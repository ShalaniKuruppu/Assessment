import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login() {
    return {
      access_token: this.jwtService.sign({ userId: 1 }),
    };
  }
}