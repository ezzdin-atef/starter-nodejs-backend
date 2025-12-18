import { Express } from 'express'
import swaggerUi from 'swagger-ui-express'
import { apiTags } from './tags'
import { errorSchemas } from './components/errors'
import { paginationSchemas } from './components/pagination'
import { authSchemas } from './components/auth'
import { env } from '@/config/env'

// Import all path definitions from modules
import { registerDoc, loginDoc, refreshDoc, logoutDoc, passwordResetDoc, oauthDoc } from '@/modules/auth/http/docs'
import { createUserDoc, getUserDoc, listUsersDoc, updateUserDoc, deleteUserDoc } from '@/modules/user/http/docs'
import { healthDoc } from '@/shared/routes/docs/health.doc'

// Merge all paths
const paths = {
  ...healthDoc,
  ...registerDoc,
  ...loginDoc,
  ...refreshDoc,
  ...logoutDoc,
  ...passwordResetDoc,
  ...oauthDoc,
  ...createUserDoc,
  ...getUserDoc,
  ...listUsersDoc,
  ...updateUserDoc,
  ...deleteUserDoc
}

// Build OpenAPI spec
const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Starter Node.js Backend API',
    version: '1.0.0',
    description: 'RESTful API documentation for the Node.js backend starter project'
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}`,
      description: 'Development server'
    },
    {
      url: env.PRODUCTION_URL,
      description: 'Production server'
    }
  ],
  tags: Object.values(apiTags),
  paths,
  components: {
    securitySchemes: {
      BearerAuth: authSchemas.BearerAuth
    },
    schemas: {
      // Auth schemas
      AuthResponse: authSchemas.AuthResponse,
      UserInToken: authSchemas.UserInToken,
      RefreshTokenResponse: authSchemas.RefreshTokenResponse,
      // Pagination schemas
      PaginationMeta: paginationSchemas.PaginationMeta,
      // User schemas
      UserResponse: {
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
          },
          avatarUrl: {
            type: 'string',
            format: 'uri',
            nullable: true,
            example: 'https://example.com/avatar.jpg'
          },
          emailVerified: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2024-01-01T00:00:00.000Z'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-01T00:00:00.000Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-01T00:00:00.000Z'
          }
        },
        required: ['id', 'email', 'createdAt', 'updatedAt']
      },
      // Error schemas
      ValidationError: errorSchemas.ValidationError,
      UnauthorizedError: errorSchemas.UnauthorizedError,
      NotFoundError: errorSchemas.NotFoundError,
      ConflictError: errorSchemas.ConflictError,
      InternalServerError: errorSchemas.InternalServerError
    }
  }
}

export function setupSwagger(app: Express) {
  // Serve OpenAPI JSON spec
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(openApiSpec)
  })

  // Serve Swagger UI
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Documentation'
  }))
}

export { openApiSpec }

