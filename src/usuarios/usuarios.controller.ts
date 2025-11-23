import { Controller, Post, Get, Body, Param, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './usuario.entity';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('registro')
  async crear(@Body() usuarioData: Partial<Usuario>) {
    try {
      return await this.usuariosService.crear(usuarioData);
    } catch (error) {
      if (error instanceof ConflictException) {
        // reenviar el error al frontend
        throw error;
      }
      console.error('Error al crear usuario:', error);
      throw new Error('Error inesperado al registrar usuario');
    }
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
