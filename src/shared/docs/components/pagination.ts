export const paginationSchemas = {
  PaginationQuery: {
    type: 'object',
    properties: {
      page: {
        type: 'integer',
        minimum: 1,
        default: 1,
        description: 'Page number (1-indexed)',
        example: 1
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        default: 20,
        description: 'Number of items per page',
        example: 20
      }
    }
  },
  PaginationMeta: {
    type: 'object',
    properties: {
      page: {
        type: 'integer',
        example: 1
      },
      limit: {
        type: 'integer',
        example: 20
      },
      total: {
        type: 'integer',
        example: 100
      },
      totalPages: {
        type: 'integer',
        example: 5
      },
      hasNext: {
        type: 'boolean',
        example: true
      },
      hasPrev: {
        type: 'boolean',
        example: false
      }
    },
    required: ['page', 'limit', 'total', 'totalPages', 'hasNext', 'hasPrev']
  }
} as const

