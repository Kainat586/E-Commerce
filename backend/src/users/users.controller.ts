import { Controller, Put,Get,Post,Delete,Param,Body,HttpException,HttpCode, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './update-user.dto';
import { CreateUserDto } from './create-user.dto';
import { create } from 'domain';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getAllUsers() {
        try{

        return this.usersService.getAllUsers();
        }catch(error){
            throw new HttpException(error.message, error.status || 500);
        }
    }
    @Get(':id')
    async getUserById(@Param('id') id: string) {
        try{
            if(!id){
                throw new HttpException('User ID is required', 400);
            }
        return this.usersService.getUserById(Number(id));
        }catch(error){
            throw new HttpException(error.message, error.status || 500);
        }
    }
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
        try{
            if(!createUserDto.name || !createUserDto.email || !createUserDto.password){
                throw new HttpException('Name, Email and Password are required', 400);
            }
            return this.usersService.createUser(createUserDto);
        
        }catch(error){
            throw new HttpException(error.message, error.status || 500);
        }
    }
    @Delete(':id')
    async deleteUser(@Param('id',ParseIntPipe) id: string) {
        try{
            if(!id){
                throw new HttpException('User ID is required', 400);
            }
        return this.usersService.deleteUser(Number(id));
        }catch(error){
            throw new HttpException(error.message, error.status || 500);
        }
    }

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        try{
            if(!id){
                throw new HttpException('User ID is required', 400);
            }
        return this.usersService.updateUser(Number(id), updateUserDto);
        }catch(error){
            throw new HttpException(error.message, error.status || 500);
        }
    }
}
