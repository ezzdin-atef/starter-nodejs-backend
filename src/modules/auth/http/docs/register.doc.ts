export const registerDoc = {
  '/api/v1/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register a new user',
      description: 'Creates a new user account and automatically logs them in',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@example.com',
                  description: 'Valid email address'
                },
                password: {
                  type: 'string',
                  minLength: 8,
                  maxLength: 100,
                  example: 'SecurePassword123!',
                  description: 'Password must be at least 8 characters'
                },
                name: {
                  type: 'string',
                  maxLength: 255,
                  example: 'John Doe',
                  description: 'Optional user name'
                }
              }
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'User registered and logged in successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse'
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
        },
        '409': {
          description: 'User already exists',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ConflictError'
              }
            }
          }
        }
      }
    }
  }
} as const

