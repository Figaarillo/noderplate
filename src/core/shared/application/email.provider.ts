export interface EmailPayload {
  to: string
  subject: string
  html: string
}

export interface EmailProvider {
  sendEmail: (payload: EmailPayload) => Promise<void>
}
