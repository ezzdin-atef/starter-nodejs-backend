import nodemailer, { Transporter } from 'nodemailer'
import { EmailService, EmailOptions } from '../domain/services/EmailService'
import { env } from '@/config/env'
import { logger } from '@/config/logger'

export class NodemailerEmailService implements EmailService {
  private transporter: Transporter

  constructor() {
    // Create transporter based on environment
    if (env.NODE_ENV === 'production') {
      // Production: Use SMTP configuration
      if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD) {
        throw new Error('SMTP configuration is required in production. Please set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD environment variables.')
      }

      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: Number(env.SMTP_PORT || 587),
        secure: env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASSWORD
        }
      })
    } else {
      // Development: Use Ethereal Email (fake SMTP for testing) or configured SMTP
      // If SMTP is configured, use it; otherwise use Ethereal for testing
      if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD) {
        this.transporter = nodemailer.createTransport({
          host: env.SMTP_HOST,
          port: Number(env.SMTP_PORT || 587),
          secure: env.SMTP_SECURE === 'true',
          auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASSWORD
          }
        })
      } else {
        // Use Ethereal Email for testing (creates fake emails)
        // Note: In development without SMTP, emails won't actually be sent
        // but you can view them at https://ethereal.email if credentials are generated
        logger.warn('SMTP not configured. Email sending will be simulated in development mode.')
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: 'test@ethereal.email',
            pass: 'test'
          }
        })
      }
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: env.SMTP_FROM || env.SMTP_USER || 'noreply@example.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.htmlToText(options.html)
      }

      const info = await this.transporter.sendMail(mailOptions)

      if (env.NODE_ENV === 'development') {
        const previewUrl = nodemailer.getTestMessageUrl(info)
        logger.info('Email sent (development mode)', {
          messageId: info.messageId,
          previewUrl,
          to: options.to,
          subject: options.subject
        })

        // Log preview URL for development (Ethereal emails)
        if (previewUrl) {
          logger.info(`Preview email at: ${previewUrl}`)
        }
      } else {
        logger.info('Email sent successfully', {
          messageId: info.messageId,
          to: options.to,
          subject: options.subject
        })
      }
    } catch (error) {
      logger.error('Failed to send email', {
        error,
        to: options.to,
        subject: options.subject
      })
      throw new Error('Failed to send email')
    }
  }

  private htmlToText(html: string): string {
    // Simple HTML to text conversion
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim()
  }
}

