import { transporter } from "../config/nodemailer.config";

export default class NodemailerHelper {
  static async sendEmail(email: string, subject: string, html: string) {
    const info = await transporter.sendMail({
      from: "Portal <portal@portal.com>",
      to: email,
      subject,
      html,
    });
    return info;
  }
}