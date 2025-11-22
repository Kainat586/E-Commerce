import { IsString, MinLength, Matches, IsEmail, IsOptional } from 'class-validator';
import { Role } from 'generated/prisma/enums';


export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @Matches(/^[A-Za-z\s]+$/, { message: 'Name must not contain special characters' })
  name: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  @Matches(/^(BUYER|SELLER)$/i, { message: 'Role must be either buyer or seller' })
  role?: Role;
}
