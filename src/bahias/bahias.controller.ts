import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BahiasService } from './bahias.service';
import { CreateBahiaDto } from './dto/create-bahia.dto';
import { UpdateBahiaDto } from './dto/update-bahia.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('bahias')
@UseGuards(JwtAuthGuard)
export class BahiasController {
  constructor(private readonly bahiasService: BahiasService) {}

  @Post()
  create(@Body() createBahiaDto: CreateBahiaDto) {
    return this.bahiasService.create(createBahiaDto);
  }

  @Get()
  findAll() {
    return this.bahiasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bahiasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBahiaDto: UpdateBahiaDto) {
    return this.bahiasService.update(id, updateBahiaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bahiasService.remove(id);
  }
}
