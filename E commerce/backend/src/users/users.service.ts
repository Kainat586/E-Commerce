import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // ✅ Create Seller or Buyer
  async createUser(data: { name: string; email: string; password: string; role: 'SELLER' | 'BUYER' }) {
    // validate role
    if (data.role !== 'SELLER' && data.role !== 'BUYER') {
      throw new BadRequestException('Role must be either SELLER or BUYER');
    }

    // check duplicate email
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new BadRequestException('Email already exists');

    // hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // create user
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  // ✅ Get all users
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ✅ Get user by ID
  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  // ✅ Delete user
  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException('User not found');
    return this.prisma.user.delete({ where: { id } });
  }
  async updateUser(id: number, data: { name?: string; email?: string; password?: string; role?: 'SELLER' | 'BUYER' }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException('User not found');
    if (data.email) {
        const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser && existingUser.id !== id) {
            throw new BadRequestException('Email already exists');
        }
    }
    let updatedData: any = { ...data };
    if (data.password) {
        updatedData.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.user.update({
        where: { id },
        data: updatedData,
        select: { id: true, name: true, email: true, role: true },
    });
  }
}
