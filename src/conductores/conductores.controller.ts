import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ConductoresService } from './conductores.service';
import { CreateConductoreDto } from './dto/create-conductore.dto';
import { UpdateConductoreDto } from './dto/update-conductore.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('conductores')
@UseGuards(JwtAuthGuard)
export class ConductoresController {
  constructor(private readonly conductoresService: ConductoresService) {}

  @Post()
  create(@Body() createConductoreDto: CreateConductoreDto) {
    return this.conductoresService.create(createConductoreDto);
  }

  @Get()
  findAll() {
    return this.conductoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conductoresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConductoreDto: UpdateConductoreDto) {
    return this.conductoresService.update(id, updateConductoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conductoresService.remove(id);
  }
}
