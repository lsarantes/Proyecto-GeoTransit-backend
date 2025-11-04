import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RutasBahiasService } from './rutas_bahias.service';
import { CreateRutasBahiaDto } from './dto/create-rutas_bahia.dto';
import { UpdateRutasBahiaDto } from './dto/update-rutas_bahia.dto';

@Controller('rutas-bahias')
export class RutasBahiasController {
  constructor(private readonly rutasBahiasService: RutasBahiasService) {}

  @Post()
  create(@Body() createRutasBahiaDto: CreateRutasBahiaDto) {
    return this.rutasBahiasService.create(createRutasBahiaDto);
  }

  @Get()
  findAll() {
    return this.rutasBahiasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rutasBahiasService.findOne(id, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRutasBahiaDto: UpdateRutasBahiaDto) {
    return this.rutasBahiasService.update(id, id, updateRutasBahiaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rutasBahiasService.remove(id, id);
  }
}
