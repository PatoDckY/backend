import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService
  ) {}

  async validarUsuario(correo: string, contrasena: string) {
    const usuario = await this.usuariosService.obtenerPorCorreo(correo);
    if (!usuario) throw new UnauthorizedException('Correo o contraseña incorrectos');

    const passValido = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passValido) throw new UnauthorizedException('Correo o contraseña incorrectos');

    return usuario;
  }

  async login(usuario: any) {
    const payload = { id: usuario.id, correo: usuario.correo };
    return {
      mensaje: 'Login exitoso',
      token: this.jwtService.sign(payload),
      usuario,
    };
  }
}
