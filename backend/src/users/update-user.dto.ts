import { IsNotEmpty,IsEmail,IsOptional,IsString,Matches } from "class-validator";
export class UpdateUserDto {
    @IsOptional()
    @IsString({ message: 'Name must be a string' })
    name?: string;
    @IsOptional()
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email?: string
    @IsOptional()
    password?:string;
    @IsOptional()
    @Matches(/^(buyer|seller)$/, { message: 'Role must be either buyer or seller' })
    @IsString({ message: 'Role must be a string' })
    role?:string;
}