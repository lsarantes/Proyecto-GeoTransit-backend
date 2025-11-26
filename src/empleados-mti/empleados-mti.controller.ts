import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EmpleadosMtiService } from './empleados-mti.service';
import { CreateEmpleadosMtiDto } from './dto/create-empleados-mti.dto';
import { UpdateEmpleadosMtiDto } from './dto/update-empleados-mti.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('empleados-mti')
@UseGuards(JwtAuthGuard)
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
