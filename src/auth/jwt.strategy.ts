import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usuariosService: UsuariosService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // ❌ No permitir tokens expirados
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret', // ✅ Evita que sea undefined
    });
  }

 async validate(payload: any) {
    const usuario = await this.usuariosService.obtenerPorId(payload.sub);

    if (!usuario) {
      throw new UnauthorizedException('Token inválido o usuario no encontrado');
    }

    return {
      id: usuario.id,
      correo: usuario.correo,
      nombre: usuario.nombre,
      apellidoPaterno: usuario.apellidoPaterno,
      apellidoMaterno: usuario.apellidoMaterno,
    };
  }

}
