import type { FastifyInstance } from 'fastify'
import { swaggerConfig, authSchemas, authResponses } from '../../../../infrastructure/swagger/swagger.config'

export function registerAuthSwaggerRoutes(app: FastifyInstance): void {
  app.get('/api-docs/openapi.json', async () => {
    const openApiSpec = {
      ...swaggerConfig,
      paths: {
        '/api/users/auth/register': {
          post: {
            tags: ['Auth'],
            summary: 'Register a new user',
            description: 'Create a new user account',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: authSchemas.RegisterRequest
                }
              }
            },
            responses: {
              '201': authResponses.RegisterResponse,
              '400': authResponses.ErrorResponse
            }
          }
        },
        '/api/users/auth/login': {
          post: {
            tags: ['Auth'],
            summary: 'Login user',
            description: 'Authenticate user and receive JWT tokens',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: authSchemas.LoginRequest
                }
              }
            },
            responses: {
              '200': authResponses.LoginResponse,
              '401': authResponses.ErrorResponse
            }
          }
        },
        '/api/users/auth/change-password': {
          post: {
            tags: ['Auth'],
            summary: 'Change password',
            description: 'Change password for authenticated user',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: authSchemas.ChangePasswordRequest
                }
              }
            },
            responses: {
              '200': authResponses.ChangePasswordResponse,
              '400': authResponses.ErrorResponse,
              '401': authResponses.ErrorResponse
            }
          }
        },
        '/api/users/auth/refresh-token': {
          post: {
            tags: ['Auth'],
            summary: 'Refresh access token',
            description: 'Refresh JWT access token using refresh token cookie',
            responses: {
              '200': authResponses.RefreshTokenResponse,
              '401': authResponses.ErrorResponse
            }
          }
        },
        '/api/auth/login-2fa': {
          post: {
            tags: ['2FA'],
            summary: 'Login with 2FA',
            description: 'Initiate login requiring two-factor authentication',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: authSchemas.Login2FARequest
                }
              }
            },
            responses: {
              '200': authResponses.Login2FAResponse,
              '401': authResponses.ErrorResponse
            }
          }
        },
        '/api/auth/verify-2fa': {
          post: {
            tags: ['2FA'],
            summary: 'Verify 2FA code',
            description: 'Verify the 6-digit code from 2FA',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: authSchemas.Verify2FARequest
                }
              }
            },
            responses: {
              '200': authResponses.Verify2FAResponse,
              '400': authResponses.ErrorResponse
            }
          }
        },
        '/api/auth/resend-2fa': {
          post: {
            tags: ['2FA'],
            summary: 'Resend 2FA code',
            description: 'Resend the verification code',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: authSchemas.Resend2FARequest
                }
              }
            },
            responses: {
              '200': {
                description: 'Code resent successfully',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        message: { type: 'string' }
                      }
                    }
                  }
                }
              },
              '400': authResponses.ErrorResponse
            }
          }
        },
        '/api/auth/forgot-password': {
          post: {
            tags: ['Auth'],
            summary: 'Request password reset',
            description: 'Request a password reset code via email',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: authSchemas.ForgotPasswordRequest
                }
              }
            },
            responses: {
              '200': authResponses.ForgotPasswordResponse
            }
          }
        },
        '/api/auth/reset-password': {
          post: {
            tags: ['Auth'],
            summary: 'Reset password',
            description: 'Reset password using verification code',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: authSchemas.ResetPasswordRequest
                }
              }
            },
            responses: {
              '200': authResponses.ResetPasswordResponse,
              '400': authResponses.ErrorResponse
            }
          }
        }
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT access token from login response'
          }
        }
      }
    }

    return openApiSpec
  })
}
