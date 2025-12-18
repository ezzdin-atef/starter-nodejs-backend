export const create<%= Entity %>Doc = {
  '<%= routePath %>': {
    post: {
      tags: ['<%= Entity %>s'],
      summary: 'Create a new <%= entity %>',
      description: 'Creates a new <%= entity %>.',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: [],
              properties: {
                // TODO: Add properties
              }
            }
          }
        }
      },
      responses: {
        '201': {
          description: '<%= Entity %> created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/<%= Entity %>Response'
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
        }
      }
    }
  }
} as const

