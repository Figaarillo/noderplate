# Flujo de Verificación de Email

## Descripción

Se implementó un sistema de verificación de email por código de 6 dígitos antes de permitir el login.

## Flujo

1. **Registro**: El usuario se registra pero no puede hacer login hasta verificar su email.
2. **Envío de código**: Se envía un código de verificación por email.
3. **Verificación**: El usuario verifica su email con el código.
4. **Login**: Una vez verificado, el usuario puede hacer login.

## Endpoints

### Registro

```
POST /api/users
Body: {
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890",
  "city": "City",
  "province": "Province",
  "country": "Country"
}
Response: {
  "data": {
    "id": "uuid",
    "message": "Usuario registrado. Por favor verifica tu email."
  }
}
```

### Verificación de Email

```
POST /api/users/verify
Body: {
  "email": "user@example.com",
  "code": "123456"
}
Response: {
  "data": {
    "success": true,
    "message": "Email verificado correctamente"
  }
}
```

### Login

```
POST /api/users/auth/login
Body: {
  "email": "user@example.com",
  "password": "Password123!"
}
Response: {
  "data": {
    "id": "uuid",
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

## Cambios en Código

### Schema de Prisma

- `src/app/config/prisma/schema.prisma`: Agregados campos `status`, `isEmailVerified`, `verificationCode`, `verificationExp`

### Patrón State (Simplificado)

- `src/core/users/domain/user-status.ts`: Estado `PENDING` → `VERIFIED` | `SUSPENDED`

### Entity

- `src/core/users/domain/entities/user.entity.ts`: Métodos `setVerificationCode()`, `verifyEmail()`, `isVerified()`, `canLogin()`

### Use Cases

- `src/core/users/application/use-cases/register.usecase.ts`: Ahora envía email con código y no genera tokens
- `src/core/users/application/use-cases/verify-email.usecase.ts` (nuevo): Verifica el código
- `src/core/users/application/use-cases/login.usecase.ts`: Verifica que el email esté verificado

### Rutas Fastify

- `src/interfaces/http/fastify/users/routes/user.route.ts`: Nueva ruta `POST /api/users/verify`

### Rutas NestJS

- `src/interfaces/http/nest/users/controllers/users.controller.ts`: Nuevo endpoint `POST /api/users/verify`
- `src/interfaces/http/nest/users/modules/users.module.ts`: Actualizado para usar emailProvider

## Para Nuevas Entidades

El patrón se puede adaptar fácilmente:

1. Agregar campos de verificación al schema
2. Crear un UseCase de verificación
3. Agregar la ruta correspondiente
4. Modificar el login para verificar el estado
