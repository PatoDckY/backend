import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { correo: string; contrasena: string }) {
    const usuario = await this.authService.validarUsuario(body.correo, body.contrasena);
    return this.authService.login(usuario);
  }
}
