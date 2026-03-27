# Two-Factor Authentication (2FA) - Documentación

## Overview

Este sistema implementa autenticación en 2 pasos (2FA) que no depende del frontend. El flujo completo funciona así:

```
Usuario → Login → Backend envía código por email → Backend renderiza página de verificación → Usuario ingresa código → Acceso granted
```

## Arquitectura

### Estructura de archivos

```
src/
├── core/
│   ├── auth/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── verification-code.entity.ts    # Entidad de código de verificación
│   │   │   └── repositories/
│   │   │       └── verification-code.repository.ts  # Interface del repositorio
│   │   └── application/
│   │       ├── services/
│   │       │   └── two-factor-auth.service.ts       # Lógica de 2FA
│   │       └── use-cases/
│   │           ├── request-two-factor-code.usecase.ts
│   │           └── verify-two-factor-code.usecase.ts
│   └── shared/
│       └── application/
│           └── email.provider.ts                   # Interface para enviar emails
├── infrastructure/
│   ├── email/
│   │   └── nodemailer.provider.ts                 # Implementación con nodemailer
│   ├── templates/
│   │   └── verification-code.email.template.ts     # HTML de email y página de verificación
│   └── persistence/
│       └── in-memory/
│           └── verification-code.repository.ts      # Repositorio en memoria
└── interfaces/
    └── http/
        ├── fastify/
        │   └── auth/
        │       ├── controllers/
        │       │   └── auth.controller.ts           # Controlador de auth
        │       └── routes/
        │           └── auth-2fa.route.ts          # Rutas de 2FA
        └── nest/                    # ✅ 2FA también disponible en NestJS
            └── auth/
                ├── controllers/
                │   └── auth.controller.ts        # Controlador NestJS
                └── modules/
                    └── auth.module.ts             # Módulo de auth
```

## Flujo de Login con 2FA

### 1. Usuario intenta login

```
POST /api/users/auth/login
Body: { "email": "user@example.com", "password": "password123" }
```

### 2. Backend verifica credenciales

- Busca usuario por email
- Verifica password con bcrypt
- **Si son válidas**: Envía código 2FA y retorna `requiresVerification: true` con un `tempToken`

### 3. Backend envía código por email

```typescript
// Código de 6 dígitos generado automáticamente
const code = generateVerificationCode() // ej: "123456"
```

### 4. Backend redirige a página de verificación

El frontend recibe el `tempToken` y redirige a:

```
GET /auth/verify?token=TEMP_TOKEN&type=login
```

### 5. Usuario ingresa código en página renderizada por backend

La página HTML es renderizada directamente por el backend (no requiere frontend).

### 6. Verificación del código

```
POST /api/auth/verify-2fa
Body: {
  "token": "TEMP_TOKEN",
  "code": "123456",
  "type": "login"
}
```

### 7. Acceso concedido

Si el código es válido, el backend retorna los tokens de acceso reales:

```json
{
  "message": "Verification successful",
  "redirect": "/dashboard"
}
```

## Tipos de Verificación

Los códigos de verificación pueden ser de diferentes tipos:

- `LOGIN` - Verificación al iniciar sesión
- `REGISTER` - Verificación al registrar nuevo usuario
- `PASSWORD_RESET` - Recuperación de contraseña
- `EMAIL_VERIFICATION` - Verificación de email

## Rutas API

| Método | Ruta                          | Descripción                        |
| ------ | ----------------------------- | ---------------------------------- |
| GET    | `/auth/verify?token=X&type=Y` | Página de verificación renderizada |
| POST   | `/api/auth/verify-2fa`        | Verifica el código ingresa         |
| POST   | `/api/auth/resend-2fa`        | Reenvía código de verificación     |

## Runtime

**2FA funciona tanto con Fastify como con NestJS.**

Puerto unificado: `8080` (ambos runtimes usan el mismo puerto)

## Configuración de Email

Variables de entorno requeridas en `.env`:

```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_user
EMAIL_PASS=your_password
EMAIL_FROM=noreply@yourdomain.com
```

## Pruebas con Postman

### Flujo completo de login con 2FA

#### Paso 1: Login inicial

```http
POST http://localhost:3000/api/users/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Respuesta esperada:**

```json
{
  "data": {
    "requiresVerification": true,
    "tempToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Paso 2: Abrir página de verificación

Usar el `tempToken` de la respuesta anterior:

```
GET http://localhost:3000/auth/verify?token=YOUR_TEMP_TOKEN&type=login
```

Esto retorna una página HTML con un formulario para ingresar el código.

#### Paso 3: Verificar código (desde la página o API)

```http
POST http://localhost:3000/api/auth/verify-2fa
Content-Type: application/json

{
  "token": "YOUR_TEMP_TOKEN",
  "code": "123456",
  "type": "login"
}
```

**Respuesta exitosa:**

```json
{
  "message": "Verification successful",
  "redirect": "/dashboard"
}
```

#### Paso 4: Reenviar código (si no llegó)

```http
POST http://localhost:3000/api/auth/resend-2fa
Content-Type: application/json

{
  "token": "YOUR_TEMP_TOKEN",
  "type": "login"
}
```

## Cómo resolví el problema de "no depender del frontend"

### El Problema Original

El usuario quería que la verificación 2FA no dependiera del frontend para renderizar la página de ingreso del código.

### La Solución

1. **Página HTML renderizada en el backend**:

   - Creé un template HTML en `verification-code.email.template.ts`
   - Este HTML se sirve directamente desde el backend en la ruta `/auth/verify`
   - El HTML incluye JavaScript embebido que se comunica con la API

2. **Token temporal**:

   - Después de verificar credenciales, se genera un token temporal (no de acceso)
   - Este token se pasa a la página de verificación
   - Se usa para identificar al usuario durante el proceso de 2FA

3. **Flujo desacoplado**:
   - El frontend solo necesita redirigir a `/auth/verify?token=X&type=Y`
   - El backend maneja todo el proceso de verificación
   - Después de verificar, redirige a `/dashboard`

## Seguridad

- Códigos de verificación de 6 dígitos
- Expiración de 10 minutos
- Un solo uso por código
- Solo un código pendiente por usuario/tipo a la vez
- Tokens temporales firmados con JWT
- Cookies httpOnly para tokens de sesión

---

## Notas Adicionales

### Arquitectura General

El flujo de 2FA es independiente del framework HTTP:

- La lógica de negocio está en `src/core/auth/`
- El servicio `TwoFactorAuthService` maneja la generación y verificación de códigos
- El HTML de verificación es generado por `src/infrastructure/templates/verification-code.email.template.ts`
- Los controladores existen para ambos frameworks: Fastify y NestJS
