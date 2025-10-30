import { Controller, Get, Param } from '@nestjs/common';
import { StylesService } from './styles.service';
@Controller('styles')
export class StylesController {
    // Controller methods would go here
    constructor(private readonly stylesService: StylesService) {}
    @Get()
    findAll() {
        return this.stylesService.findAll();
    }

    @Get(':name')
    findByName(@Param('name') name: string) {
        return this.stylesService.findByName(name);
    }
}
