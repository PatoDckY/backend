import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { correo: string; contrasena: string }) {
    const usuario = await this.authService.validarUsuario(body.correo, body.contrasena);
    return this.authService.login(usuario);
  }

  // 👇 NUEVO ENDPOINT: obtener perfil autenticado
  @UseGuards(AuthGuard('jwt'))
  @Get('perfil')
  obtenerPerfil(@Req() req) {
    return req.user;
  }
}
