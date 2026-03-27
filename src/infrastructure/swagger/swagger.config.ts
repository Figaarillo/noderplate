export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Noderplate API',
    description: 'Noderplate - Modular Node.js API with hexagonal architecture',
    version: '1.0.0',
    contact: {
      name: 'Noderplate',
      url: 'https://github.com/noderplate/noderplate'
    }
  },
  servers: [
    {
      url: 'http://localhost:8080',
      description: 'Development server'
    }
  ],
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Users', description: 'User management endpoints' },
    { name: '2FA', description: 'Two-Factor Authentication endpoints' }
  ]
}

export const authSchemas = {
  RegisterRequest: {
    type: 'object',
    required: ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'city', 'province', 'country'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      phoneNumber: { type: 'string' },
      city: { type: 'string' },
      province: { type: 'string' },
      country: { type: 'string' }
    }
  },
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    }
  },
  ChangePasswordRequest: {
    type: 'object',
    required: ['currentPassword', 'newPassword'],
    properties: {
      currentPassword: { type: 'string' },
      newPassword: { type: 'string', minLength: 6 }
    }
  },
  Login2FARequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    }
  },
  Verify2FARequest: {
    type: 'object',
    required: ['token', 'code', 'type'],
    properties: {
      token: { type: 'string', description: 'Temporary JWT token from login-2fa' },
      code: { type: 'string', pattern: '^[0-9]{6}$', description: '6-digit verification code' },
      type: { type: 'string', enum: ['LOGIN', 'REGISTER', 'PASSWORD_RESET', 'EMAIL_VERIFICATION'] }
    }
  },
  Resend2FARequest: {
    type: 'object',
    required: ['token', 'type'],
    properties: {
      token: { type: 'string' },
      type: { type: 'string', enum: ['LOGIN', 'REGISTER', 'PASSWORD_RESET', 'EMAIL_VERIFICATION'] }
    }
  },
  ForgotPasswordRequest: {
    type: 'object',
    required: ['email'],
    properties: {
      email: { type: 'string', format: 'email' }
    }
  },
  ResetPasswordRequest: {
    type: 'object',
    required: ['token', 'code', 'newPassword'],
    properties: {
      token: { type: 'string', description: 'Temporary JWT token' },
      code: { type: 'string', pattern: '^[0-9]{6}$', description: '6-digit verification code' },
      newPassword: { type: 'string', minLength: 6 }
    }
  },
  RefreshTokenRequest: {
    type: 'object',
    properties: {}
  }
}

export const authResponses = {
  RegisterResponse: {
    description: 'User registered successfully',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' }
              }
            }
          }
        }
      }
    }
  },
  LoginResponse: {
    description: 'Login successful',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' }
                  }
                },
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' }
              }
            }
          }
        }
      }
    }
  },
  Login2FAResponse: {
    description: 'Login requires 2FA verification',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            requiresVerification: { type: 'boolean' },
            tempToken: { type: 'string' }
          }
        }
      }
    }
  },
  Verify2FAResponse: {
    description: '2FA verification successful',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            redirect: { type: 'string' }
          }
        }
      }
    }
  },
  ForgotPasswordResponse: {
    description: 'Password reset email sent',
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
  ResetPasswordResponse: {
    description: 'Password reset successful',
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
  ChangePasswordResponse: {
    description: 'Password changed successfully',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                message: { type: 'string' }
              }
            }
          }
        }
      }
    }
  },
  RefreshTokenResponse: {
    description: 'Token refreshed successfully',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' }
              }
            }
          }
        }
      }
    }
  },
  ErrorResponse: {
    description: 'Error response',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }
}
