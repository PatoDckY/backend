import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🔹 Inicio de sesión normal
  @Post('login')
  async login(@Body() body: { correo: string; contrasena: string }) {
    const usuario = await this.authService.validarUsuario(body.correo, body.contrasena);
    return this.authService.login(usuario);
  }

  // 🔹 Enviar enlace mágico
  @Post('magic-link')
  async enviarMagicLink(@Body() body: { correo: string }) {
    return this.authService.enviarEnlaceMagico(body.correo);
  }

  // 🔹 Verificar token del enlace mágico
  @Get('verify-magic')
  async verificarMagicToken(@Query('token') token: string) {
    return this.authService.validarEnlaceMagico(token);
  }
}
