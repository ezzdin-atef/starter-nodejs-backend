export const healthDoc = {
  '/health': {
    get: {
      tags: ['Health'],
      summary: 'Health check',
      description: 'Returns basic server status information',
      responses: {
        '200': {
          description: 'Server is healthy',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'ok'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-01-01T00:00:00.000Z'
                  },
                  uptime: {
                    type: 'number',
                    description: 'Server uptime in seconds',
                    example: 3600
                  },
                  environment: {
                    type: 'string',
                    example: 'development'
                  }
                },
                required: ['status', 'timestamp', 'uptime', 'environment']
              }
            }
          }
        }
      }
    }
  },
  '/ready': {
    get: {
      tags: ['Health'],
      summary: 'Readiness check',
      description: 'Verifies database connectivity and returns readiness status',
      responses: {
        '200': {
          description: 'Server is ready',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'ready'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-01-01T00:00:00.000Z'
                  },
                  checks: {
                    type: 'object',
                    properties: {
                      database: {
                        type: 'string',
                        example: 'ok'
                      }
                    },
                    required: ['database']
                  }
                },
                required: ['status', 'timestamp', 'checks']
              }
            }
          }
        },
        '503': {
          description: 'Server is not ready',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'not ready'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  },
                  checks: {
                    type: 'object',
                    properties: {
                      database: {
                        type: 'string',
                        example: 'error'
                      }
                    }
                  },
                  error: {
                    type: 'string',
                    example: 'Database connection failed'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
} as const

