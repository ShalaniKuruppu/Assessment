import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { User } from './user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async signUp(dto: SignUpDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const existing = await this.userRepo.findOne({ where: { email: normalizedEmail } });

    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const user = this.userRepo.create({
      name: dto.name.trim(),
      email: normalizedEmail,
      passwordHash: this.hashPassword(dto.password),
    });

    const saved = await this.userRepo.save(user);

    return {
      id: saved.id,
      name: saved.name,
      email: saved.email,
    };
  }

  async signIn(dto: SignInDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const user = await this.userRepo.findOne({ where: { email: normalizedEmail } });

    if (!user || !this.verifyPassword(dto.password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      access_token: this.jwtService.sign({
        userId: user.id,
        email: user.email,
      }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  private hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, storedHash: string) {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) {
      return false;
    }

    const incomingHash = scryptSync(password, salt, 64).toString('hex');
    return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(incomingHash, 'hex'));
  }
}