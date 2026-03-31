import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { User } from './user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.ensureAdminAccount();
  }

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
      role: 'user',
    });

    const saved = await this.userRepo.save(user);

    return {
      id: saved.id,
      name: saved.name,
      email: saved.email,
      role: saved.role,
    };
  }

  async signIn(dto: SignInDto) {
    const user = await this.validateCredentials(dto);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: User) {
    return {
      access_token: this.jwtService.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
      }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  private async validateCredentials(dto: SignInDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const user = await this.userRepo.findOne({ where: { email: normalizedEmail } });

    if (!user || !this.verifyPassword(dto.password, user.passwordHash)) {
      return null;
    }

    return user;
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

  private async ensureAdminAccount() {
    const adminEmail =
      this.configService.get<string>('ADMIN_EMAIL')?.trim().toLowerCase() ||
      'admin@mo-marketplace.local';
    const adminPassword =
      this.configService.get<string>('ADMIN_PASSWORD') ||
      'Admin@12345';
    const adminName = this.configService.get<string>('ADMIN_NAME')?.trim() || 'System Admin';

    const existing = await this.userRepo.findOne({ where: { email: adminEmail } });

    if (existing) {
      existing.role = 'admin';
      existing.name = adminName;
      existing.passwordHash = this.hashPassword(adminPassword);
      await this.userRepo.save(existing);
      return;
    }

    const admin = this.userRepo.create({
      name: adminName,
      email: adminEmail,
      passwordHash: this.hashPassword(adminPassword),
      role: 'admin',
    });

    await this.userRepo.save(admin);
  }
}