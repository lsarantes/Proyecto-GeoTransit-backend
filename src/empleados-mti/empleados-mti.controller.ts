import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmpleadosMtiService } from './empleados-mti.service';
import { CreateEmpleadosMtiDto } from './dto/create-empleados-mti.dto';
import { UpdateEmpleadosMtiDto } from './dto/update-empleados-mti.dto';

@Controller('empleados-mti')
export class EmpleadosMtiController {
  constructor(private readonly empleadosMtiService: EmpleadosMtiService) {}

  @Post()
  create(@Body() createEmpleadosMtiDto: CreateEmpleadosMtiDto) {
    return this.empleadosMtiService.create(createEmpleadosMtiDto);
  }

  @Get()
  findAll() {
    return this.empleadosMtiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empleadosMtiService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmpleadosMtiDto: UpdateEmpleadosMtiDto) {
    return this.empleadosMtiService.update(id, updateEmpleadosMtiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.empleadosMtiService.remove(id);
  }
}
