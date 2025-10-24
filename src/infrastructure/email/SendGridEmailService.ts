import sgMail from "@sendgrid/mail";

export class SendGridEmailService {
  private isConfigured: boolean = false;

  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (apiKey && apiKey.trim() !== '') {
      sgMail.setApiKey(apiKey);
      this.isConfigured = true;
    } else {
      console.warn('Verificacion de correos preparada');
    }
  }

  async sendVerificationEmail(to: string, name: string, token: string) {
    if (!this.isConfigured) {
      console.log(` [SIMULADO] Email de verificación para ${to} con token: ${token}`);
      return;
    }

    const link = `${process.env.BASE_URL}/api/v1/users/verify?token=${token}`;

    const msg = {
      to,
      from: process.env.EMAIL_FROM!,
      subject: "Verifica tu cuenta en EnviaYa ",
      html: `
        <h2>¡Hola ${name}!</h2>
        <p>Gracias por registrarte en <b>EnviaYa</b>. Para activar tu cuenta, haz clic en el siguiente enlace:</p>
        <a href="${link}" target="_blank" style="color:#007bff;">Verificar cuenta</a>
        <p>Si no creaste esta cuenta, ignora este correo.</p>
      `,
    };

    await sgMail.send(msg);
  }
}
