import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UpdateEncargadoscooperativaDto } from './dto/update-encargadoscooperativa.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EncargadoService } from './encargado.service';
import { CreateEncargadoDto } from './dto/create-encargadoscooperativa.dto';

@Controller('encargado')
@UseGuards(JwtAuthGuard)
export class EncargadoController {
  constructor(private readonly encargadoService: EncargadoService) {}

  @Post()
  create(@Body() createEncargadoscooperativaDto: CreateEncargadoDto) {
    return this.encargadoService.create(createEncargadoscooperativaDto);
  }

  @Get()
  findAll() {
    return this.encargadoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.encargadoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEncargadoscooperativaDto: UpdateEncargadoscooperativaDto) {
    return this.encargadoService.update(id, updateEncargadoscooperativaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.encargadoService.remove(id);
  }
}
