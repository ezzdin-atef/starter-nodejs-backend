export const authSchemas = {
  BearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'JWT token obtained from login or register endpoint'
  },
  AuthResponse: {
    type: 'object',
    properties: {
      accessToken: {
        type: 'string',
        description: 'JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      },
      refreshToken: {
        type: 'string',
        description: 'JWT refresh token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      },
      user: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com'
          },
          name: {
            type: 'string',
            nullable: true,
            example: 'John Doe'
          }
        },
        required: ['id', 'email']
      }
    },
    required: ['accessToken', 'refreshToken', 'user']
  },
  UserInToken: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      email: {
        type: 'string',
        format: 'email',
        example: 'user@example.com'
      },
      name: {
        type: 'string',
        nullable: true,
        example: 'John Doe'
      }
    },
    required: ['id', 'email']
  },
  RefreshTokenResponse: {
    type: 'object',
    properties: {
      accessToken: {
        type: 'string',
        description: 'New JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      },
      refreshToken: {
        type: 'string',
        description: 'New JWT refresh token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    },
    required: ['accessToken', 'refreshToken']
  }
} as const

