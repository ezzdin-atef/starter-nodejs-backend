export const errorSchemas = {
  ValidationError: {
    type: 'object',
    properties: {
      error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Validation failed'
          },
          statusCode: {
            type: 'number',
            example: 400
          },
          errors: {
            type: 'object',
            additionalProperties: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            example: {
              email: ['Email must be a valid email address'],
              password: ['Password must be at least 8 characters']
            }
          }
        },
        required: ['message', 'statusCode']
      }
    }
  },
  UnauthorizedError: {
    type: 'object',
    properties: {
      error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Unauthorized'
          },
          statusCode: {
            type: 'number',
            example: 401
          }
        },
        required: ['message', 'statusCode']
      }
    }
  },
  NotFoundError: {
    type: 'object',
    properties: {
      error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Resource not found'
          },
          statusCode: {
            type: 'number',
            example: 404
          }
        },
        required: ['message', 'statusCode']
      }
    }
  },
  ConflictError: {
    type: 'object',
    properties: {
      error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Resource already exists'
          },
          statusCode: {
            type: 'number',
            example: 409
          }
        },
        required: ['message', 'statusCode']
      }
    }
  },
  InternalServerError: {
    type: 'object',
    properties: {
      error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Internal server error'
          },
          statusCode: {
            type: 'number',
            example: 500
          }
        },
        required: ['message', 'statusCode']
      }
    }
  }
} as const

