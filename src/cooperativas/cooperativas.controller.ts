import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateCooperativaDto, UpdateCooperativaDto } from './dto/create-cooperativa.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // Asumiendo que tienes Auth
import { CooperativaService } from './cooperativas.service';

@UseGuards(JwtAuthGuard) // Protegemos todo el controlador
@Controller('cooperativa')
export class CooperativaController {
  constructor(private readonly cooperativaService: CooperativaService) {}

  @Post()
  create(@Body() createCooperativaDto: CreateCooperativaDto) {
    return this.cooperativaService.create(createCooperativaDto);
  }

  @Get()
  findAll() {
    return this.cooperativaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cooperativaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCooperativaDto: UpdateCooperativaDto) {
    return this.cooperativaService.update(id, updateCooperativaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cooperativaService.remove(id);
  }
}