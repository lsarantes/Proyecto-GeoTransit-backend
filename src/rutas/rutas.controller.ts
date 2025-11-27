import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RutaService } from './rutas.service';

@Controller('rutas')
@UseGuards(JwtAuthGuard)
export class RutasController {
  constructor(private readonly rutasService: RutaService) {}

  @Post()
  create(@Body() createRutaDto: CreateRutaDto) {
    return this.rutasService.create(createRutaDto);
  }

  @Get()
  findAll() {
    return this.rutasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rutasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRutaDto: UpdateRutaDto) {
    return this.rutasService.update(id, updateRutaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rutasService.remove(id);
  }
}
