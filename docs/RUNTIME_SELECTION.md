# Runtime Selection

Noderplate supports multiple HTTP frameworks and ORMs. This document explains how to select and switch between different runtimes.

## Supported Runtimes

### HTTP Frameworks

- **NestJS** - Framework node.js progresivo para construir aplicaciones eficientes y escalables
- **Fastify** - Framework web muy rápido y de bajo overhead

### ORMs

- **Prisma** - ORM moderno con tipos seguros y migrations integradas
- **MikroORM** - ORM TypeScript headless flexible

## Comandos de Selección

### Ver Configuración Actual

```bash
make runtime.info
```

Muestra el HTTP runtime y ORM actualmente configurados.

### Seleccionar HTTP Runtime

```bash
# Usar NestJS
make runtime.set.nest

# Usar Fastify
make runtime.set.fastify
```

O usando el comando combinado:

```bash
make runtime.set http=nest
make runtime.set http=fastify
```

### Seleccionar ORM

```bash
# Usar Prisma
make runtime.set.prisma

# Usar MikroORM
make runtime.set.mikroorm
```

O usando el comando combinado:

```bash
make runtime.set orm=prisma
make runtime.set orm=mikroorm
```

### Seleccionar Ambos a la Vez

```bash
make runtime.set http=nest orm=prisma
make runtime.set http=fastify orm=mikroorm
```

## Uso Directo del Script

También puedes usar el script directamente:

```bash
node scripts/select-runtime.cjs --http nest --orm prisma
```

### Opciones

| Opción   | Descripción   | Valores              |
| -------- | ------------- | -------------------- |
| `--http` | HTTP runtime  | `nest`, `fastify`    |
| `--orm`  | ORM           | `prisma`, `mikroorm` |
| `--help` | Mostrar ayuda | -                    |

## Lo que Sucede al Cambiar Runtime

### Cambiar HTTP Runtime

1. Se actualiza `.env` con el nuevo valor de `HTTP_RUNTIME`
2. Se elimina el directorio del framework no usado (`src/interfaces/http/nest` o `src/interfaces/http/fastify`)
3. Se elimina el archivo bootstrap no usado

### Cambiar ORM

1. Se actualiza `.env` con el nuevo valor de `ORM`
2. Se elimina el directorio del ORM no usado (`src/infrastructure/persistence/prisma` o `src/infrastructure/persistence/mikro-orm`)

## Después de Cambiar Runtime

Después de cambiar el runtime, verifica que el proyecto compila correctamente:

```bash
pnpm build
```

Si usas Prisma, también puedes generar el cliente:

```bash
pnpm prisma generate
```

## Estructura de Archivos After Selection

### Con NestJS + Prisma

```
src/
├── app/
│   ├── bootstrap/
│   │   └── nest.bootstrap.ts    ✅
│   └── config/
│       └── prisma/              ✅
├── infrastructure/
│   └── persistence/
│       └── prisma/              ✅
└── interfaces/
    └── http/
        └── nest/                ✅
```

### Con Fastify + MikroORM

```
src/
├── app/
│   ├── bootstrap/
│   │   └── fastify.bootstrap.ts ✅
│   └── config/
│       └── mikro-orm.config.ts   ✅
├── infrastructure/
│   └── persistence/
│       └── mikro-orm/           ✅
└── interfaces/
    └── http/
        └── fastify/             ✅
```

## Variables de Entorno

El archivo `.env` se actualiza automáticamente:

```env
# HTTP Runtime
HTTP_RUNTIME=nest

# ORM
ORM=prisma
```

## Notas

- El proyecto siempre debe funcionar con cualquier combinación de runtime/ORM
- Los archivos no usados se eliminan automáticamente
- La configuración es mutuamente excluyente (solo un HTTP framework y un ORM)
- El cambio es idempotente (puedes ejecutarlo múltiples veces)
