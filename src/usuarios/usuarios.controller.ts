import { Controller, Post, Get, Body, Param, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './usuario.entity';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('registro')
  async crear(@Body() usuarioData: Partial<Usuario>) {
    return this.usuariosService.crear(usuarioData);
  }

  @Get()
  async obtenerTodos() {
    return this.usuariosService.obtenerTodos();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: number) {
    return this.usuariosService.obtenerPorId(id);
  }
}
