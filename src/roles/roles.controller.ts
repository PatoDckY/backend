import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Rol } from './rol.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async obtenerTodos(): Promise<Rol[]> {
    return this.rolesService.obtenerTodos();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: number): Promise<Rol> {
    const rol = await this.rolesService.obtenerPorId(id);

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    return rol;
  }

  @Post()
  async crear(@Body() data: Partial<Rol>): Promise<Rol> {
    try {
      return await this.rolesService.crear(data);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ese rol ya existe');
      }
      throw error;
    }
  }
}
