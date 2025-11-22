import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'generated/prisma/enums';


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      const role = createUserDto.role?.toUpperCase() || 'BUYER';

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: hashedPassword,
          role:Role[role as keyof typeof Role],
        },
        select: { id: true, name: true, email: true, role: true },
      });

      return { message: 'User created successfully', user };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new BadRequestException(error.message || 'Failed to create user');
    }
  }

  async getAllUsers(): Promise<any[]> {
    try {
      return await this.prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new BadRequestException('Error fetching users');
    }
  }

  async getUserById(id: number): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true },
      });

      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('User not found');

      if (data.email) {
        const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser && existingUser.id !== id) {
          throw new BadRequestException('Email already exists');
        }
      }

      const updatedData: any = { ...data };
      if (data.password) {
        updatedData.password = await bcrypt.hash(data.password, 10);
      }

      if (data.role) {
        updatedData.role = data.role.toUpperCase();
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updatedData,
        select: { id: true, name: true, email: true, role: true },
      });

      return { message: 'User updated successfully', updatedUser };
    } catch (error) {
      console.error('Error updating user:', error);
      throw new BadRequestException(error.message);
    }
  }

  async deleteUser(id: number): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('User not found');

      await this.prisma.user.delete({ where: { id } });
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
