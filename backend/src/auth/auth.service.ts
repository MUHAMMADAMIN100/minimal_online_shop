import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email уже используется');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hash, name: dto.name },
    });
    return this.sign(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Неверный email или пароль');

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Неверный email или пароль');

    return this.sign(user);
  }

  private sign(user: { id: string; email: string; role: string; name: string | null }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      token: this.jwt.sign(payload),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }
}
