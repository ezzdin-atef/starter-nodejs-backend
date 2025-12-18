export interface PasswordResetEmailData {
  userName?: string
  resetLink: string
  expiresIn: string // e.g., "1 hour"
}

export function generatePasswordResetEmail(data: PasswordResetEmailData): { subject: string; html: string; text: string } {
  const subject = 'Reset Your Password'
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
    <h1 style="color: #333; margin-top: 0;">Password Reset Request</h1>
    
    <p>Hello${data.userName ? ` ${data.userName}` : ''},</p>
    
    <p>We received a request to reset your password. Click the button below to reset it:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.resetLink}" 
         style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Reset Password
      </a>
    </div>
    
    <p>Or copy and paste this link into your browser:</p>
    <p style="background-color: #f9f9f9; padding: 10px; border-radius: 3px; word-break: break-all;">
      <a href="${data.resetLink}" style="color: #007bff;">${data.resetLink}</a>
    </p>
    
    <p style="color: #666; font-size: 14px;">
      <strong>Important:</strong> This link will expire in ${data.expiresIn}. If you didn't request this password reset, please ignore this email.
    </p>
    
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      If you're having trouble clicking the button, copy and paste the URL above into your web browser.
    </p>
    
    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
    
    <p style="color: #999; font-size: 12px; margin: 0;">
      This is an automated message, please do not reply to this email.
    </p>
  </div>
</body>
</html>
  `.trim()

  const text = `
Password Reset Request

Hello${data.userName ? ` ${data.userName}` : ''},

We received a request to reset your password. Use the link below to reset it:

${data.resetLink}

Important: This link will expire in ${data.expiresIn}. If you didn't request this password reset, please ignore this email.

This is an automated message, please do not reply to this email.
  `.trim()

  return { subject, html, text }
}

