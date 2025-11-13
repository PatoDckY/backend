import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private magicLinks = new Map<string, string>(); // token temporal => correo

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService
  ) {}

  // 🔹 Validar login normal
  async validarUsuario(correo: string, contrasena: string) {
    const usuario = await this.usuariosService.obtenerPorCorreo(correo);
    if (!usuario) throw new UnauthorizedException('Correo o contraseña incorrectos');

    const passValido = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passValido) throw new UnauthorizedException('Correo o contraseña incorrectos');

    return usuario;
  }

  // 🔹 Generar token JWT
  async login(usuario: any) {
    const payload = { sub: usuario.id, correo: usuario.correo, nombre: usuario.nombre };
    return {
      mensaje: 'Inicio de sesión exitoso',
      token: this.jwtService.sign(payload),
      usuario,
    };
  }

  // 📩 Enviar enlace mágico por correo
  async enviarEnlaceMagico(correo: string) {
    const usuario = await this.usuariosService.obtenerPorCorreo(correo);
    if (!usuario) throw new UnauthorizedException('Correo no registrado');

    const token = uuidv4();
    this.magicLinks.set(token, correo);

    // Construcción del enlace (Render + frontend)
    const magicUrl = `${process.env.FRONTEND_URL}/magic-login?token=${token}`;
    console.log('📩 Enviando enlace mágico a:', correo, '→', magicUrl);

    try {
      // Configuración de nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Enviar correo
      await transporter.sendMail({
        from: `"Soporte 👶" <${process.env.EMAIL_USER}>`,
        to: correo,
        subject: 'Tu enlace mágico para iniciar sesión ✨',
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center;">
            <h2>Hola ${usuario.nombre} 👋</h2>
            <p>Haz clic en el siguiente botón para iniciar sesión sin contraseña:</p>
            <a href="${magicUrl}" 
              style="background-color:#6c63ff; color:white; padding:10px 20px; text-decoration:none; border-radius:8px;">
              Iniciar sesión
            </a>
            <p>Este enlace expirará en 10 minutos.</p>
          </div>
        `,
      });

      // Expiración automática
      setTimeout(() => this.magicLinks.delete(token), 10 * 60 * 1000);

      return { mensaje: '✅ Enlace mágico enviado. Revisa tu correo.' };
    } catch (error) {
      console.error('❌ Error al enviar correo mágico:', error);
      throw new InternalServerErrorException('No se pudo enviar el enlace mágico.');
    }
  }

  // 🔐 Validar token del enlace mágico
  async validarEnlaceMagico(token: string) {
    const correo = this.magicLinks.get(token);
    if (!correo) throw new UnauthorizedException('Enlace inválido o expirado');

    const usuario = await this.usuariosService.obtenerPorCorreo(correo);
    if (!usuario) throw new UnauthorizedException('Usuario no encontrado');

    this.magicLinks.delete(token); // eliminar tras usarlo

    return this.login(usuario);
  }
}
