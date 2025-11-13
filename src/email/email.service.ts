import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async enviarCorreo(destinatario: string, asunto: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"Tu App 👶" <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: asunto,
        html,
      });

      console.log('Correo enviado: ', info.messageId);
      return true;
    } catch (error) {
      console.error('Error al enviar correo:', error);
      return false;
    }
  }
}
