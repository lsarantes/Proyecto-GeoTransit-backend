import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CooperativasService } from './cooperativas.service';
import { CreateCooperativaDto } from './dto/create-cooperativa.dto';
import { UpdateCooperativaDto } from './dto/update-cooperativa.dto';

@Controller('cooperativas')
export class CooperativasController {
  constructor(private readonly cooperativasService: CooperativasService) {}

  @Post()
  create(@Body() createCooperativaDto: CreateCooperativaDto) {
    return this.cooperativasService.create(createCooperativaDto);
  }

  @Get()
  findAll() {
    return this.cooperativasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cooperativasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCooperativaDto: UpdateCooperativaDto) {
    return this.cooperativasService.update(id, updateCooperativaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cooperativasService.remove(id);
  }
}
