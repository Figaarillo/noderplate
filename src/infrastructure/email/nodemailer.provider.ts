import nodemailer from 'nodemailer'
import type { EmailProvider, EmailPayload } from '../../core/shared/application/email.provider'
import { env } from '../../app/config/env'

export class NodemailerEmailProvider implements EmailProvider {
  private readonly transporter: nodemailer.Transporter
  private readonly isMock: boolean

  constructor() {
    const hasCredentials = env.email.auth?.user && env.email.auth?.pass

    this.isMock = !hasCredentials || env.email.host === 'sandbox.smtp.mailtrap.io'

    if (this.isMock && env.email.host === 'sandbox.smtp.mailtrap.io') {
      // eslint-disable-next-line no-console
      console.log('[Email] Using mock email provider (logging to console)')
      this.transporter = nodemailer.createTransport({
        jsonTransport: true
      })
    } else {
      this.transporter = nodemailer.createTransport({
        host: env.email.host,
        port: env.email.port,
        secure: env.email.secure,
        auth: hasCredentials
          ? {
              user: env.email.auth.user,
              pass: env.email.auth.pass
            }
          : undefined
      })
    }
  }

  async sendEmail(payload: EmailPayload): Promise<void> {
    if (this.isMock) {
      // eslint-disable-next-line no-console
      console.log('[MOCK EMAIL]')
      // eslint-disable-next-line no-console
      console.log(`To: ${payload.to}`)
      // eslint-disable-next-line no-console
      console.log(`Subject: ${payload.subject}`)
      // eslint-disable-next-line no-console
      console.log(`Body: ${payload.html?.substring(0, 200)}...`)
      return
    }

    await this.transporter.sendMail({
      from: env.email.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html
    })
  }
}
