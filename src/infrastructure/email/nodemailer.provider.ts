import nodemailer from 'nodemailer'
import type { EmailProvider, EmailPayload } from '../../core/shared/application/email.provider'
import { env } from '../../app/config/env'

export class NodemailerEmailProvider implements EmailProvider {
  private readonly transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.email.host,
      port: env.email.port,
      secure: env.email.secure,
      auth: env.email.auth
        ? {
            user: env.email.auth.user,
            pass: env.email.auth.pass
          }
        : undefined
    })
  }

  async sendEmail(payload: EmailPayload): Promise<void> {
    await this.transporter.sendMail({
      from: env.email.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html
    })
  }
}
