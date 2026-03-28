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

| Método | Ruta                              | Descripción                               |
| ------ | --------------------------------- | ----------------------------------------- |
| POST   | `/api/users/auth/register`        | Registrar nuevo usuario                   |
| POST   | `/api/users/auth/login`           | Iniciar sesión                            |
| POST   | `/api/users/auth/change-password` | Cambiar password (usuario logueado)       |
| POST   | `/api/users/auth/refresh-token`   | Refrescar token de acceso                 |
| GET    | `/auth/verify?token=X&type=Y`     | Página de verificación 2FA renderizada    |
| POST   | `/api/auth/verify-2fa`            | Verifica el código de 2FA                 |
| POST   | `/api/auth/resend-2fa`            | Reenvía código de verificación 2FA        |
| POST   | `/api/auth/forgot-password`       | Solicita código para recuperar contraseña |
| GET    | `/auth/reset-password?token=X`    | Página de reset de password renderizada   |
| POST   | `/api/auth/reset-password`        | Resetear password con código              |
| POST   | `/api/auth/login-2fa`             | Login con 2FA habilitado                  |

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

### Flujo completo de login (sin 2FA)

#### Paso 1: Registrar usuario

```http
POST http://localhost:8080/api/users/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstname": "john",
  "lastname": "doe",
  "phonenumber": "+1234567890",
  "city": "new york",
  "province": "ny",
  "country": "usa"
}
```

#### Paso 2: Login

```http
POST http://localhost:8080/api/users/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Respuesta exitosa:**

```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

#### Paso 3: Cambiar password (usuario logueado)

```http
POST http://localhost:8080/api/users/auth/change-password
Content-Type: application/json
Authorization: Bearer ACCESS_TOKEN

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Respuesta exitosa:**

```json
{
  "data": {
    "message": "Password changed successfully"
  }
}
```

#### Paso 4: Refrescar token

```http
POST http://localhost:8080/api/users/auth/refresh-token
Content-Type: application/json
Cookie: refreshToken=REFRESH_TOKEN_COOKIE

{}
```

**Respuesta exitosa:**

```json
{
  "data": {
    "accessToken": "NEW_ACCESS_TOKEN"
  }
}
```

### Flujo de Login con 2FA

#### Paso 1: Login con 2FA

```http
POST http://localhost:8080/api/auth/login-2fa
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Respuesta esperada:**

```json
{
  "requiresVerification": true,
  "tempToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Paso 2: Abrir página de verificación

Usar el `tempToken` de la respuesta anterior:

```
GET http://localhost:8080/auth/verify?token=YOUR_TEMP_TOKEN&type=login
```

Esto retorna una página HTML con un formulario para ingresar el código.

#### Paso 3: Verificar código (desde la página o API)

```http
POST http://localhost:8080/api/auth/verify-2fa
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
POST http://localhost:8080/api/auth/resend-2fa
Content-Type: application/json

{
  "token": "YOUR_TEMP_TOKEN",
  "type": "login"
}
```

### Flujo de Recuperación de Contraseña (olvidé mi password)

#### Paso 1: Solicitar recuperación de contraseña

```http
POST http://localhost:8080/api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Respuesta esperada:**

```json
{
  "message": "If the email exists, a verification code has been sent"
}
```

#### Paso 2: Abrir página de reset de contraseña

El usuario recibe un email con el código. Usar el token del paso anterior:

```
GET http://localhost:8080/auth/reset-password?token=YOUR_TEMP_TOKEN
```

Esto retorna una página HTML con un formulario para ingresar el código y la nueva contraseña.

#### Paso 3: Resetear contraseña

```http
POST http://localhost:8080/api/auth/reset-password
Content-Type: application/json

{
  "token": "YOUR_TEMP_TOKEN",
  "code": "123456",
  "newPassword": "newpassword123"
}
```

**Respuesta exitosa:**

```json
{
  "message": "Password reset successfully"
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

## Flujo de Recuperación de Contraseña

### 1. Usuario solicita recuperación

```
POST http://localhost:8080/api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Respuesta:**

```json
{
  "message": "If the email exists, a verification code has been sent"
}
```

### 2. Usuario recibe código por email

El código de 6 dígitos se envía por email.

### 3. Usuario abre página de reset

```
GET http://localhost:8080/auth/reset-password?token=TEMP_TOKEN
```

Esto retorna una página HTML con formulario para ingresar código y nueva contraseña.

### 4. Usuario ingresa código y nueva contraseña

```http
POST http://localhost:8080/api/auth/reset-password
Content-Type: application/json

{
  "token": "YOUR_TEMP_TOKEN",
  "code": "123456",
  "newPassword": "newpassword123"
}
```

**Respuesta exitosa:**

```json
{
  "message": "Password reset successfully"
}
```

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

---

## Autenticación con Cookies y Headers

### Cookies usadas

El sistema utiliza las siguientes cookies:

| Cookie         | Tipo     | Descripción               |
| -------------- | -------- | ------------------------- |
| `accessToken`  | httpOnly | Token de acceso JWT (1h)  |
| `refreshToken` | httpOnly | Token de refresh JWT (7d) |

### Autenticación en Postman

Para endpoints que requieren autenticación, tienes dos opciones:

#### Opción 1: Cookies (automático)

Postman maneja automáticamente las cookies entre requests si tienes la opción "Follow redirects" habilitada y el servidor devuelve las cookies.

#### Opción 2: Header Authorization

```http
POST http://localhost:8080/api/users/auth/change-password
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

### Configuración de Cookies en Postman

1. **Cookies**: En la pestaña "Cookies" del request, las cookies se manejan automáticamente
2. **Variables**: Guarda el `accessToken` en una variable de colección para reutilizarlo

```javascript
// En el tab "Tests" del login:
var jsonData = pm.response.json()
pm.collectionVariables.set('accessToken', jsonData.data.accessToken)
```

### Variables de Entorno JWT

Configura en `.env`:

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ACCESS_TOKEN_SECRET=your-access-token-secret
JWT_REFRESH_TOKEN_SECRET=your-refresh-token-secret
JWT_ACCESS_TOKEN_EXPIRES_IN=1h
JWT_REFRESH_TOKEN_EXPIRES_IN=7d
```

---

## Resumen de Endpoints de Autenticación

| Método | Endpoint                          | Auth                | Descripción              |
| ------ | --------------------------------- | ------------------- | ------------------------ |
| POST   | `/api/users/auth/register`        | ❌                  | Registrar usuario        |
| POST   | `/api/users/auth/login`           | ❌                  | Login (retorna cookies)  |
| POST   | `/api/users/auth/login-2fa`       | ❌                  | Login con 2FA            |
| POST   | `/api/users/auth/change-password` | ✅                  | Cambiar password         |
| POST   | `/api/users/auth/refresh-token`   | ✅ (refresh cookie) | Refrescar access token   |
| GET    | `/auth/verify`                    | ❌                  | Página verificación 2FA  |
| POST   | `/api/auth/verify-2fa`            | ❌                  | Verificar código 2FA     |
| POST   | `/api/auth/resend-2fa`            | ❌                  | Reenviar código 2FA      |
| POST   | `/api/auth/forgot-password`       | ❌                  | Solicitar reset password |
| GET    | `/auth/reset-password`            | ❌                  | Página reset password    |
| POST   | `/api/auth/reset-password`        | ❌                  | Resetear password        |
