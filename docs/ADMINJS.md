# AdminJS - Panel de Administración

## ¿Qué es AdminJS?

AdminJS es una biblioteca que genera automáticamente una interfaz de administración para tu aplicación Node.js. Es similar a Django Admin o Rails Admin, pero para Node.js.

## ¿Por qué usar AdminJS en Noderplate?

### Casos de uso principales:

1. **Gestión de usuarios**: Ver, crear, editar y eliminar usuarios
2. **Administración de datos**: CRUD completo sobre cualquier modelo de la base de datos
3. **Panel de control**: Dashboard para ver estadísticas rápidas
4. **Gestión de contenido**: Administración de contenido sin necesidad de desarrollar un CMS

### Ventajas:

- ✅ **Sin desarrollo frontend**: Interfaz generada automáticamente
- ✅ **Integración con Prisma**: Funciona nativamente con tu esquema de base de datos
- ✅ **Personalizable**: Puedes agregar acciones personalizadas, validaciones y más
- ✅ **Autenticación incluida**: Sistema de login/logout integrado
- ✅ **UI moderna**: Interfaz responsiva y profesional

## Instalación

AdminJS ya está instalado en el proyecto. Los paquetes instalados son:

```bash
pnpm add admin @adminjs/prisma @adminjs/nestjs @adminjs/fastify
```

## Configuración

### Archivo de configuración principal

La configuración principal está en:

```
src/infrastructure/admin/admin.config.ts
```

```typescript
import AdminJS from 'adminjs'
import { Database, Resource } from '@adminjs/prisma'
import { prisma } from '../persistence/prisma/shared/client'

AdminJS.registerAdapter({ Database, Resource })

const prismaModel = (prisma as any)._baseDmmf

export const adminJs = new AdminJS({
  databases: [
    {
      database: prisma,
      name: 'prisma',
      models: prismaModel.modelMap
    }
  ],
  rootPath: '/admin',
  branding: {
    companyName: 'Noderplate'
  }
})
```

### Configuración de seguridad

Las siguientes variables de entorno deben estar configuradas en producción:

```env
# Cookies y sesión de AdminJS
ADMIN_COOKIE_PASSWORD=super-secret-cookie-password
ADMIN_SESSION_SECRET=super-secret-session-secret
```

## Uso

### Acceso al panel

Una vez que el servidor está corriendo:

- **URL**: `http://localhost:8080/admin`
- **Credenciales**: Las primeras credenciales se crean automáticamente en el primer acceso

### Rutas disponibles

| Ruta            | Descripción                |
| --------------- | -------------------------- |
| `/admin`        | Panel principal de AdminJS |
| `/admin/login`  | Página de login            |
| `/admin/logout` | Cerrar sesión              |

## Configuración por Runtime

### Fastify (ya configurado)

AdminJS está integrado en el bootstrap de Fastify:

```typescript
// src/app/bootstrap/fastify.bootstrap.ts
await app.register(AdminJSFastify, {
  adminJs: adminJsConfig.adminJs,
  auth: adminJsConfig.auth,
  sessionSecret: adminJsConfig.sessionSecret
})
```

### NestJS (configuración básica)

El módulo Admin de NestJS está registrado en AppModule:

```typescript
// src/interfaces/http/nest/app.module.ts
@Module({
  imports: [UsersModule, AuthModule, AdminModule],
  controllers: [HealthController]
})
export class AppModule {}
```

**Nota**: La integración completa de AdminJS con NestJS requiere configuración adicional del adaptador Express. Para una integración más completa, consulta la [documentación oficial de AdminJS NestJS](https://docs.adminjs.co//tutorial-nestjs.html).

## Personalización

### Modelos disponibles

Por defecto, AdminJS está configurado para mostrar el modelo `User` de Prisma:

```typescript
// Configuración actual en admin.config.ts
resources: [
  {
    resource: prismaAdapter,
    options: {
      name: 'Users',
      listProperties: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt'],
      editProperties: ['firstName', 'lastName', 'email', 'phoneNumber', 'city', 'province', 'country', 'role'],
      showProperties: [
        'id',
        'email',
        'firstName',
        'lastName',
        'phoneNumber',
        'city',
        'province',
        'country',
        'role',
        'createdAt',
        'updatedAt'
      ]
    }
  }
]
```

### Agregar más modelos

Para agregar más modelos a AdminJS, modifica `src/infrastructure/admin/admin.config.ts`:

```typescript
export const adminJs = new AdminJS({
  databases: [
    /* ... */
  ],
  resources: [
    {
      resource: { model: prismaModel.modelMap.User, client: prisma },
      options: {
        name: 'Users'
        // opciones adicionales
      }
    },
    {
      resource: { model: prismaModel.modelMap.Product, client: prisma },
      options: {
        name: 'Products'
        // opciones adicionales
      }
    }
  ]
})
```

### Personalizar propiedades

Puedes controlar qué campos son visibles, editables, etc.:

```typescript
options: {
  listProperties: ['id', 'email', 'role', 'createdAt'],  // Columnas en lista
  editProperties: ['email', 'role'],  // Campos editables
  showProperties: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt', 'updatedAt'],  // Detalles
  filterProperties: ['email', 'role', 'createdAt'],  // Filtros disponibles
}
```

## Variables de Entorno

```env
# AdminJS Security
ADMIN_COOKIE_PASSWORD=your-secure-cookie-password
ADMIN_SESSION_SECRET=your-secure-session-secret
```

## Arquitectura Flexible

Gracias a la arquitectura hexagonal de Noderplate, AdminJS se integra a través de:

1. **Infrastructure**: `src/infrastructure/admin/admin.config.ts` - Configuración centralizada
2. **Interfaces**: Se conecta a través de los adaptadores HTTP (Fastify/NestJS)

Esto significa que puedes:

- Usar AdminJS independientemente del runtime HTTP
- Personalizar la configuración sin afectar la lógica de negocio
- Agregar nuevos modelos sin modificar el código de la aplicación

## Ejemplo de uso en desarrollo

```bash
# Iniciar el servidor
make run.dev

# Acceder al panel de admin
# Navegar a http://localhost:8080/admin
```

## Recursos adicionales

- [Documentación oficial de AdminJS](https://docs.adminjs.co/)
- [AdminJS Prisma Adapter](https://docs.adminjs.co/tutorial-prisma.html)
- [AdminJS NestJS](https://docs.adminjs.co/tutorial-nestjs.html)
