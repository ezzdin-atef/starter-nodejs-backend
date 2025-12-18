export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export interface EmailService {
  sendEmail(options: EmailOptions): Promise<void>
}

