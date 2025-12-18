export const update<%= Entity %>Doc = {
  '<%= routePath %>/{id}': {
    patch: {
      tags: ['<%= Entity %>s'],
      summary: 'Update <%= entity %>',
      description: 'Updates <%= entity %> information.',
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
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                // TODO: Add properties
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: '<%= Entity %> updated successfully',
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

