import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailService } from '../email/email.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
  ) {}

  @Post('login')
  async login(@Body() body: { correo: string; contrasena: string }) {
    const usuario = await this.authService.validarUsuario(body.correo, body.contrasena);
    return this.authService.login(usuario);
  }

  // 📩 Enviar enlace mágico
  @Post('magic-link')
  async enviarMagicLink(@Body() body: { correo: string }) {
    const resultado = await this.authService.enviarEnlaceMagico(body.correo);
    return resultado;
  }

  // 🔐 Validar token del enlace mágico
  @Get('verify-magic')
  async verificarMagicToken(@Query('token') token: string) {
    return this.authService.validarEnlaceMagico(token);
  }
}
