export const list<%= Entity %>sDoc = {
  '<%= routePath %>': {
    get: {
      tags: ['<%= Entity %>s'],
      summary: 'List <%= entities %>',
      description: 'Retrieves a paginated list of <%= entities %>.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          description: 'Page number (1-indexed)',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
            example: 1
          }
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Number of items per page',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 20,
            example: 20
          }
        }
      ],
      responses: {
        '200': {
          description: '<%= Entity %>s retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/<%= Entity %>Response'
                    }
                  },
                  pagination: {
                    $ref: '#/components/schemas/PaginationMeta'
                  }
                },
                required: ['data', 'pagination']
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

