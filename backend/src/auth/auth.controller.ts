import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { JwtAuthGuard } from './jwt.guard';
import { CurrentUser } from './current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: { id: string }) {
    const u = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    return u;
  }
}
