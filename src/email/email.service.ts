import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    // Inicializa Resend con tu API key
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async enviarCorreo(destinatario: string, asunto: string, html: string) {
    try {
      const data = await this.resend.emails.send({
        from: 'Tu App <no-reply@resend.dev>', // puedes usar tu propio dominio verificado
        to: destinatario,
        subject: asunto,
        html,
      });

      console.log('✅ Correo enviado correctamente:', data);
      return true;
    } catch (error) {
      console.error('❌ Error al enviar correo con Resend:', error);
      throw new InternalServerErrorException('Error al enviar correo');
    }
  }
}
