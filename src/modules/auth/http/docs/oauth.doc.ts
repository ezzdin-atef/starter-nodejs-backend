export const oauthDoc = {
  '/api/v1/auth/google': {
    get: {
      tags: ['Auth'],
      summary: 'Initiate Google OAuth',
      description: 'Redirects to Google OAuth consent screen',
      responses: {
        '302': {
          description: 'Redirect to Google OAuth',
          headers: {
            Location: {
              schema: {
                type: 'string',
                example: 'https://accounts.google.com/o/oauth2/v2/auth?...'
              }
            }
          }
        },
        '503': {
          description: 'Google OAuth not configured',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'Google OAuth is not configured'
                      },
                      statusCode: {
                        type: 'number',
                        example: 503
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/v1/auth/google/callback': {
    get: {
      tags: ['Auth'],
      summary: 'Google OAuth callback',
      description: 'Handles Google OAuth callback and returns authentication tokens',
      parameters: [
        {
          name: 'code',
          in: 'query',
          required: true,
          description: 'Authorization code from Google',
          schema: {
            type: 'string'
          }
        }
      ],
      responses: {
        '200': {
          description: 'OAuth authentication successful',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse'
              }
            }
          }
        },
        '400': {
          description: 'Missing authorization code',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError'
              }
            }
          }
        },
        '503': {
          description: 'Google OAuth not configured',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'Google OAuth is not configured'
                      },
                      statusCode: {
                        type: 'number',
                        example: 503
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/v1/auth/github': {
    get: {
      tags: ['Auth'],
      summary: 'Initiate GitHub OAuth',
      description: 'Redirects to GitHub OAuth consent screen',
      responses: {
        '302': {
          description: 'Redirect to GitHub OAuth',
          headers: {
            Location: {
              schema: {
                type: 'string',
                example: 'https://github.com/login/oauth/authorize?...'
              }
            }
          }
        },
        '503': {
          description: 'GitHub OAuth not configured',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'GitHub OAuth is not configured'
                      },
                      statusCode: {
                        type: 'number',
                        example: 503
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/v1/auth/github/callback': {
    get: {
      tags: ['Auth'],
      summary: 'GitHub OAuth callback',
      description: 'Handles GitHub OAuth callback and returns authentication tokens',
      parameters: [
        {
          name: 'code',
          in: 'query',
          required: true,
          description: 'Authorization code from GitHub',
          schema: {
            type: 'string'
          }
        }
      ],
      responses: {
        '200': {
          description: 'OAuth authentication successful',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse'
              }
            }
          }
        },
        '400': {
          description: 'Missing authorization code',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError'
              }
            }
          }
        },
        '503': {
          description: 'GitHub OAuth not configured',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'GitHub OAuth is not configured'
                      },
                      statusCode: {
                        type: 'number',
                        example: 503
                      }
                    }
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

