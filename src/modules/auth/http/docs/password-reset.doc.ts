export const passwordResetDoc = {
  '/api/v1/auth/password/reset-request': {
    post: {
      tags: ['Auth'],
      summary: 'Request password reset',
      description: 'Sends a password reset email if the email exists (always returns success to prevent email enumeration)',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@example.com'
                }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Password reset email sent (if email exists)',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'If the email exists, a password reset link has been sent'
                  }
                }
              }
            }
          }
        },
        '400': {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError'
              }
            }
          }
        }
      }
    }
  },
  '/api/v1/auth/password/reset': {
    post: {
      tags: ['Auth'],
      summary: 'Reset password',
      description: 'Resets the user password using a valid reset token',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['resetToken', 'newPassword'],
              properties: {
                resetToken: {
                  type: 'string',
                  example: 'abc123def456...',
                  description: 'Password reset token from email'
                },
                newPassword: {
                  type: 'string',
                  minLength: 8,
                  maxLength: 100,
                  example: 'NewSecurePassword123!',
                  description: 'New password (minimum 8 characters)'
                }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Password reset successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Password has been reset successfully'
                  }
                }
              }
            }
          }
        },
        '400': {
          description: 'Validation error or invalid token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError'
              }
            }
          }
        },
        '401': {
          description: 'Invalid or expired reset token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedError'
              }
            }
          }
        }
      }
    }
  }
} as const

