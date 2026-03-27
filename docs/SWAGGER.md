# Swagger / OpenAPI Documentation

## ¿Qué es Swagger/OpenAPI?

Swagger (ahora conocido como OpenAPI) es un estándar para documentar APIs REST. Permite:

- **Documentación automática**: Genera documentación interactiva desde el código
- **Pruebas integradas**: Puedes probar endpoints directamente desde la UI
- **Generación de clientes**: Herramientas para generar SDKs en diferentes lenguajes

## Acceso a Swagger UI

Una vez que el servidor está corriendo:

| Runtime     | URL Swagger UI                   | URL OpenAPI JSON                              |
| ----------- | -------------------------------- | --------------------------------------------- |
| **Fastify** | `http://localhost:8080/api-docs` | `http://localhost:8080/api-docs/openapi.json` |
| **NestJS**  | `http://localhost:8080/api-docs` | `http://localhost:8080/api-docs-json`         |

## Implementación Agnóstica

La implementación de Swagger está diseñada para ser agnóstica al framework HTTP:

### Configuración Centralizada

```
src/infrastructure/swagger/swagger.config.ts
```

Este archivo contiene:

- Configuración base de OpenAPI
- Esquemas de request/response
- Definiciones de seguridad

### Runtimes Soportados

#### Fastify

- `@fastify/swagger` - Generación de spec
- `@fastify/swagger-ui` - Interfaz visual
- Ruta dinámica: `/api-docs/openapi.json`

#### NestJS

- `@nestjs/swagger` - Decoradores y generación
- SwaggerModule.setup() - Interfaz visual
- DocumentBuilder - Configuración programática

## Endpoints Documentados

### Autenticación

| Endpoint                          | Método | Descripción       |
| --------------------------------- | ------ | ----------------- |
| `/api/users/auth/register`        | POST   | Registrar usuario |
| `/api/users/auth/login`           | POST   | Login             |
| `/api/users/auth/change-password` | POST   | Cambiar password  |
| `/api/users/auth/refresh`         | POST   | Refrescar token   |

### Two-Factor Authentication

| Endpoint               | Método | Descripción      |
| ---------------------- | ------ | ---------------- |
| `/api/auth/login-2fa`  | POST   | Login con 2FA    |
| `/api/auth/verify-2fa` | POST   | Verificar código |
| `/api/auth/resend-2fa` | POST   | Reenviar código  |

### Recuperación de Password

| Endpoint                    | Método | Descripción       |
| --------------------------- | ------ | ----------------- |
| `/api/auth/forgot-password` | POST   | Solicitar reset   |
| `/api/auth/reset-password`  | POST   | Resetear password |

### Gestión de Usuarios

| Endpoint           | Método | Descripción        |
| ------------------ | ------ | ------------------ |
| `/api/users`       | GET    | Listar usuarios    |
| `/api/users/:id`   | GET    | Obtener usuario    |
| `/api/users/email` | GET    | Buscar por email   |
| `/api/users/:id`   | PUT    | Actualizar usuario |
| `/api/users/:id`   | DELETE | Eliminar usuario   |

## Uso con Postman

### Importar desde Swagger

1. Ve a `http://localhost:8080/api-docs`
2. Copia la URL del archivo OpenAPI JSON
3. En Postman: **File > Import > Link**
4. Pega la URL: `http://localhost:8080/api-docs/openapi.json`

### Autenticación en Swagger UI

1. Haz click en el botón **Authorize**
2. Ingresa el token JWT o las credenciales
3. Algunas operaciones requieren el header `Authorization: Bearer <token>`

## Configuración de Seguridad

### Bearer Auth

La API usa JWT Bearer Token. En Swagger:

```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

Para endpoints protegidos:

1. Ejecuta `/api/users/auth/login` primero
2. Copia el `accessToken` de la respuesta
3. Haz click en **Authorize** y pega el token
4. Ahora puedes probar endpoints protegidos

## Personalización

### Agregar más endpoints a la documentación

#### Fastify

Edita `src/interfaces/http/fastify/swagger/auth-swagger.route.ts`:

```typescript
'/api/users': {
  get: {
    tags: ['Users'],
    summary: 'List users',
    // ... más configuración
  }
}
```

#### NestJS

Usa decoradores en el controlador:

```typescript
@ApiOperation({ summary: 'List users' })
@ApiResponse({ status: 200, description: 'List of users' })
@Get()
async list() { ... }
```

### Esquemas Personalizados

Agrega nuevos esquemas en `src/infrastructure/swagger/swagger.config.ts`:

```typescript
export const authSchemas = {
  MyCustomRequest: {
    type: 'object',
    properties: {
      field: { type: 'string' }
    }
  }
}
```

## Variables de Entorno

No se requieren variables de entorno específicas para Swagger. La configuración está en los archivos de código.

## Notas Técnicas

### Implementación Agnóstica

La documentación se logra de dos maneras:

1. **Fastify**: Spec dinámico definido en código (`swagger.config.ts`)
2. **NestJS**: Decoradores en DTOs y controladores + `DocumentBuilder`

### Beneficios de Esta Arquitectura

- ✅ Documentación consistente entre runtimes
- ✅ Sin dependencia de framework específico en la config
- ✅ Fácil de extender
- ✅ Type-safe con TypeScript

## Recursos Adicionales

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [NestJS Swagger](https://docs.nestjs.com/openapi/introduction)
- [Fastify Swagger](https://github.com/fastify/fastify-swagger)
