import { Controller, Put,Get,Post,Delete,Param,Body } from '@nestjs/common';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getAllUsers() {
        return this.usersService.getAllUsers();
    }
    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.usersService.getUserById(Number(id));
    }
    @Post()
    async createUser(@Body() data: { name: string; email: string; password: string; role: 'SELLER' | 'BUYER' }) {
        return this.usersService.createUser(data);
    }
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(Number(id));
    }

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() data: { name?: string; email?: string; password?: string; role?: 'SELLER' | 'BUYER' }) {
        return this.usersService.updateUser(Number(id), data);
    }
}
