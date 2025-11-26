import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PasajerosService } from './pasajeros.service';
import { CreatePasajeroDto } from './dto/create-pasajero.dto';
import { UpdatePasajeroDto } from './dto/update-pasajero.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('pasajeros')
@UseGuards(JwtAuthGuard)
export class PasajerosController {
  constructor(private readonly pasajerosService: PasajerosService) {}

  @Post()
  create(@Body() createPasajeroDto: CreatePasajeroDto) {
    return this.pasajerosService.create(createPasajeroDto);
  }

  @Get()
  findAll() {
    return this.pasajerosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pasajerosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePasajeroDto: UpdatePasajeroDto) {
    return this.pasajerosService.update(id, updatePasajeroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pasajerosService.remove(id);
  }
}
