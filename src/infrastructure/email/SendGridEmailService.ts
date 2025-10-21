import sgMail from "@sendgrid/mail";

export class SendGridEmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async sendVerificationEmail(to: string, name: string, token: string) {
    const link = `${process.env.APP_URL}/api/v1/users/verify?token=${token}`;

    const msg = {
      to,
      from: process.env.EMAIL_FROM!,
      subject: "Verifica tu cuenta en EnviaYa 🚀",
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
