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

  @Post('login')
  async login(@Body() body: { correo: string; contrasena: string }) {
    const usuario = await this.usuariosService.obtenerPorCorreo(body.correo);
    if (!usuario) throw new UnauthorizedException('Correo o contraseña incorrectos');

    const contrasenaValida = await this.usuariosService.verificarContrasena(
      body.contrasena,
      usuario.contrasena,
    );

    if (!contrasenaValida)
      throw new UnauthorizedException('Correo o contraseña incorrectos');

    // Podrías generar un token JWT aquí, pero por ahora devolvemos el usuario
    return { mensaje: 'Login exitoso', usuario };
  }
}
