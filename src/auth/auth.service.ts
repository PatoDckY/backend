import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private magicLinks = new Map<string, string>(); // token temporal => correo

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

    // Enlace que el usuario recibirá
    const magicUrl = `${process.env.FRONTEND_URL}/auth/magic-login?token=${token}`;

    // Configurar Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Enviar correo
    await transporter.sendMail({
      from: `"Soporte" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: 'Tu enlace mágico para iniciar sesión',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center;">
          <h2>Hola ${usuario.nombre} 👋</h2>
          <p>Haz clic en el siguiente botón para iniciar sesión sin contraseña:</p>
          <a href="${magicUrl}" 
            style="background-color:#007bff; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">
            Iniciar sesión
          </a>
          <p>Este enlace expirará en 10 minutos.</p>
        </div>
      `,
    });

    // El token expira en 10 minutos
    setTimeout(() => this.magicLinks.delete(token), 10 * 60 * 1000);

    return { mensaje: 'Enlace mágico enviado a tu correo' };
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
