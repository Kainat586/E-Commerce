import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(data: { name: string; email: string; password: string; role?: string }) {
  const { name, email, password, role } = data;

  if (!email) throw new BadRequestException('Email is required');
  if (!password) throw new BadRequestException('Password is required');

  const existingUser = await this.prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new BadRequestException('Email already registered');

  const hashed = await bcrypt.hash(password, 10);

  // ✅ Determine role, default to BUYER if not provided
  const userRole = role?.toUpperCase() === 'SELLER' ? 'SELLER' : 'BUYER';

  const newUser = await this.prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: userRole, // ✅ store role in DB
    },
  });

  const token = this.jwtService.sign({ id: newUser.id, role: newUser.role });

  return {
    message: 'Signup successful',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
    token,
  };
}


  async login(data: { email: string; password: string }) {
    const { email, password } = data;

    if (!email) throw new BadRequestException('Email is required');

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    const token = this.jwtService.sign({ id: user.id, role: user.role });

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}
