export const createUserDoc = {
  '/api/v1/users': {
    post: {
      tags: ['Users'],
      summary: 'Create a new user',
      description: 'Creates a new user account. Requires authentication.',
      security: [{ BearerAuth: [] }],
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
                },
                name: {
                  type: 'string',
                  maxLength: 255,
                  example: 'John Doe'
                },
                avatarUrl: {
                  type: 'string',
                  format: 'uri',
                  example: 'https://example.com/avatar.jpg'
                }
              }
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'User created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserResponse'
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
        '401': {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedError'
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

