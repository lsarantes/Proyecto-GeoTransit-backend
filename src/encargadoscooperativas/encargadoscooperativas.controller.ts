import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EncargadoscooperativasService } from './encargadoscooperativas.service';
import { CreateEncargadoscooperativaDto } from './dto/create-encargadoscooperativa.dto';
import { UpdateEncargadoscooperativaDto } from './dto/update-encargadoscooperativa.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('encargadoscooperativas')
@UseGuards(JwtAuthGuard)
export class EncargadoscooperativasController {
  constructor(private readonly encargadoscooperativasService: EncargadoscooperativasService) {}

  @Post()
  create(@Body() createEncargadoscooperativaDto: CreateEncargadoscooperativaDto) {
    return this.encargadoscooperativasService.create(createEncargadoscooperativaDto);
  }

  @Get()
  findAll() {
    return this.encargadoscooperativasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.encargadoscooperativasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEncargadoscooperativaDto: UpdateEncargadoscooperativaDto) {
    return this.encargadoscooperativasService.update(id, updateEncargadoscooperativaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.encargadoscooperativasService.remove(id);
  }
}
