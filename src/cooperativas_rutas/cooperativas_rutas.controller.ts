import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CooperativasRutasService } from './cooperativas_rutas.service';
import { CreateCooperativasRutaDto } from './dto/create-cooperativas_ruta.dto';
import { UpdateCooperativasRutaDto } from './dto/update-cooperativas_ruta.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('cooperativas-rutas')
@UseGuards(JwtAuthGuard)
export class CooperativasRutasController {
  constructor(private readonly cooperativasRutasService: CooperativasRutasService) {}

  @Post()
  create(@Body() createCooperativasRutaDto: CreateCooperativasRutaDto) {
    return this.cooperativasRutasService.create(createCooperativasRutaDto);
  }

  @Get()
  findAll() {
    return this.cooperativasRutasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cooperativasRutasService.findOne(id, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCooperativasRutaDto: UpdateCooperativasRutaDto) {
    return this.cooperativasRutasService.update(id, id, updateCooperativasRutaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cooperativasRutasService.remove(id, id);
  }
}
