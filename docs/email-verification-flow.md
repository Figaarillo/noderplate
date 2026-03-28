# Flujo de Verificación de Email

## Descripción

Se implementó un sistema de verificación de email por código de 6 dígitos antes de permitir el login.

## Flujo

1. **Registro**: El usuario se registra pero no puede hacer login hasta verificar su email.
2. **Envío de código**: Se envía un código de verificación por email.
3. **Verificación**: El usuario ingresa el código manualmente en la página de verificación.
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
  "country": "Country",
  "redirectUrl": "https://mi-app.com"  // opcional
}
Response: {
  "data": {
    "id": "uuid",
    "message": "Usuario registrado. Por favor verifica tu email.",
    "verificationUrl": "http://localhost:8080/verify-email?email=user@example.com"
  }
}
```

### Verificación de Email (API)

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

Response (error):
{
  "data": {
    "success": false,
    "message": "Código de verificación inválido. Intentos restantes: 3"
  }
}
```

### Página de Verificación (UI)

```
GET /verify-email?email=user@example.com
```

- Muestra formulario para ingresar código de 6 dígitos
- Botón "Verificar" que consume el endpoint POST /api/users/verify
- Muestra errores si el código es inválido
- Limita intentos (MAX_ATTEMPTS = 3)

### Login

```
POST /api/users/auth/login
Body: {
  "email": "user@example.com",
  "password": "Password123!"
}
Response (si email no verificado): {
  "statusCode": 401,
  "message": "Email not verified. Please verify your email first."
}

Response (éxito): {
  "data": {
    "id": "uuid",
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

## Seguridad

### Campos Protegidos

Los siguientes campos **no se devuelven** en las consultas de usuario:

- `password` (hash de la contraseña)
- `verificationCode` (código de verificación)
- `verificationExp` (fecha de expiración del código)

Esto se implementa mediante el método `toPublic()` en `UserEntity`.

### Límite de Intentos

- Máximo 3 intentos para verificar el código
- Después de 3 intentos fallidos, el código expira y debe solicitarse uno nuevo

### Expiración

- El código de verificación expira en 15 minutos

## Estructura de Archivos

```
src/
├── core/
│   └── users/
│       ├── domain/
│       │   ├── user-status.ts          # Enum y máquina de estados
│       │   └── entities/user.entity.ts  # toPublic() para proteger campos
│       └── application/
│           └── use-cases/
│               ├── register.usecase.ts      # Envía email con código
│               └── verify-email.usecase.ts   # Verifica el código
├── interfaces/
│   └── http/
│       └── fastify/
│           └── users/
│               └── routes/
│                   └── verify-email-page.route.ts  # Página HTML de verificación
```

## Para Nuevas Entidades

El patrón se puede adaptar fácilmente:

1. Agregar campos de verificación al schema de Prisma
2. Crear un UseCase de verificación
3. Crear una página HTML de verificación (opcional)
4. Agregar la ruta correspondiente
5. Modificar el login para verificar el estado
