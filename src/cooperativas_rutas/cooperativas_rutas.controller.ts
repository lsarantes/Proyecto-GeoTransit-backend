import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CooperativasRutasService } from './cooperativas_rutas.service';
import { CreateCooperativasRutaDto } from './dto/create-cooperativas_ruta.dto';
import { UpdateCooperativasRutaDto } from './dto/update-cooperativas_ruta.dto';

@Controller('cooperativas-rutas')
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
    return this.cooperativasRutasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCooperativasRutaDto: UpdateCooperativasRutaDto) {
    return this.cooperativasRutasService.update(+id, updateCooperativasRutaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cooperativasRutasService.remove(+id);
  }
}
