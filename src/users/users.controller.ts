import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmpleadoMtiService } from './users.service';
import { CreateEmpleadoMtiDto } from './dto/create-user.dto';
import { UpdateEmpleadoMtiDto } from './dto/update-user.dto';

@Controller('empleado-mti')
export class EmpleadoMtiController {
  constructor(private readonly empleadoMtiService: EmpleadoMtiService) {}

  @Get()
  findAll() {
    return this.empleadoMtiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empleadoMtiService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateEmpleadoMtiDto) {
    return this.empleadoMtiService.create(createDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateEmpleadoMtiDto) {
    return this.empleadoMtiService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.empleadoMtiService.remove(id);
  }
}