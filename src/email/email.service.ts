import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🔍 Verifica que la conexión al servicio de correo esté activa
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Error verificando conexión con Gmail:', error);
      } else {
        console.log('✅ Servidor de correo listo para enviar mensajes');
      }
    });
  }

  async enviarCorreo(destinatario: string, asunto: string, html: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"Tu App 👶" <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: asunto,
        html,
      });

      console.log(`📩 Correo enviado correctamente a ${destinatario}. ID: ${info.messageId}`);
    } catch (error) {
      console.error('❌ Error al enviar correo:', error);
      throw new InternalServerErrorException('No se pudo enviar el correo');
    }
  }
}
