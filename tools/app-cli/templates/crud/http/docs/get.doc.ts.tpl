export const get<%= Entity %>Doc = {
  '<%= routePath %>/{id}': {
    get: {
      tags: ['<%= Entity %>s'],
      summary: 'Get <%= entity %> by ID',
      description: 'Retrieves a <%= entity %> by their ID.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: '<%= Entity %> UUID',
          schema: {
            type: 'string',
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000'
          }
        }
      ],
      responses: {
        '200': {
          description: '<%= Entity %> retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/<%= Entity %>Response'
              }
            }
          }
        },
        '400': {
          description: 'Invalid <%= entity %> ID format',
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
        '404': {
          description: '<%= Entity %> not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NotFoundError'
              }
            }
          }
        }
      }
    }
  }
} as const

