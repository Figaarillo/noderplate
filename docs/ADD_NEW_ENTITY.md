# Guía para Agregar una Nueva Entidad (Nest + Prisma)

Esta guía documenta el proceso completo para agregar una nueva entidad al proyecto siguiendo la arquitectura hexagonal, utilizando **NestJS como framework HTTP** y **Prisma como ORM**.

## Tabla de Contenidos

1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Flujo de una Solicitud](#flujo-de-una-solicitud)
3. [Pasos para Agregar una Entidad](#pasos-para-agregar-una-entidad)
4. [Ejemplo: Entidad "Product"](#ejemplo-entidad-product)

---

## Estructura del Proyecto

Este proyecto utiliza una estructura modular con arquitectura hexagonal:

```
src/
├── main.ts                              # Entry point
│
├── app/                                 # Composición de la aplicación
│   ├── bootstrap/                       # Bootstrap (Nest/Fastify)
│   ├── config/                          # Configuración de entorno
│   └── container/                       # Contenedor DI (Fastify)
│
├── core/                                # Dominio puro (sin dependencias externas)
│   └── users/                           # Feature "users"
│       ├── domain/                      # Entidades, errores, payloads, repositorios
│       │   ├── entities/
│       │   ├── errors/
│       │   ├── payloads/
│       │   └── repositories/
│       └── application/                 # Casos de uso
│           └── use-cases/
│
├── infrastructure/                      # Implementaciones externas
│   └── persistence/
│       ├── prisma/                      # Prisma adapter
│       │   ├── shared/
│       │   │   └── client.ts            # Cliente Prisma global
│       │   └── users/
│       │       └── repositories/
│       │           └── user.repository.ts
│       └── mikro-orm/                   # MikroORM adapter
│
├── interfaces/                          # Adaptadores HTTP
│   └── http/
│       ├── nest/                        # NestJS adapter
│       │   ├── app.module.ts            # Módulo principal
│       │   ├── health.controller.ts
│       │   └── users/
│       │       ├── controllers/
│       │       ├── modules/
│       │       ├── providers/
│       │       └── schemas/
│       └── fastify/                    # Fastify adapter (no usado con Prisma)
│
└── shared/                             # Código compartido
    └── infrastructure/
        └── security/                   # JWT, bcrypt
```

### Diferencia con Fastify

| Aspecto      | Fastify                 | NestJS                          |
| ------------ | ----------------------- | ------------------------------- |
| Container DI | Manual (AppContainer)   | IOC Container nativo            |
| DTOs         | Zod                     | class-validator                 |
| Validación   | Middleware Zod          | Pipes                           |
| Rutas        | `app.get()` declarativo | Decoradores `@Get()`, `@Post()` |
| Módulos      | No aplica               | `@Module()` con imports/exports |

---

## Flujo de una Solicitud (Nest + Prisma)

```
POST /api/products
    │
    ▼
┌─────────────────────────────────┐
│ ProductsController              │  @Controller('api/products')
│ @Post()                         │     ↓
└────────────┬────────────────────┘
             │ @Body() → CreateProductDto
             ▼
┌─────────────────────────────────┐
│ CreateProductUseCase            │  Inyectado via @Inject()
└────────────┬────────────────────┘
             │ dependencia
             ▼
┌─────────────────────────────────┐
│ ProductRepository (interface)  │  Definida en core/
└────────────┬────────────────────┘
             │ implementación
             ▼
┌─────────────────────────────────┐
│ PrismaProductRepository         │  Implementación Prisma
└────────────┬────────────────────┘
             │ prisma.product.create()
             ▼
┌─────────────────────────────────┐
│ PostgreSQL (via Prisma Client)  │
└─────────────────────────────────┘
```

---

## Pasos para Agregar una Entidad

### Paso 1: Definir el Dominio (`core/`)

#### 1.1 Crear la entidad

```typescript
// src/core/products/domain/entities/product.entity.ts
export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  createdAt: Date
  updatedAt: Date
}
```

#### 1.2 Crear los payloads

```typescript
// src/core/products/domain/types/payloads/create-product.payload.ts
export interface CreateProductPayload {
  name: string
  description: string
  price: number
  stock: number
}

// src/core/products/domain/types/payloads/update-product.payload.ts
export interface UpdateProductPayload {
  name?: string
  description?: string
  price?: number
  stock?: number
}
```

#### 1.3 Crear errores específicos

```typescript
// src/core/products/domain/errors/product-not-found.error.ts
export class ProductNotFoundError extends Error {
  constructor() {
    super('Product not found')
    this.name = 'ProductNotFoundError'
  }
}
```

#### 1.4 Crear el repositorio (puerto/interface)

```typescript
// src/core/products/domain/repositories/product.repository.ts
import type { Product } from '../entities/product.entity'
import type { UpdateProductPayload } from '../types/payloads/update-product.payload'

export interface ProductRepository {
  list(offset: number, limit: number): Promise<Product[]>
  findById(id: string): Promise<Product | null>
  findByEmail(email: string): Promise<Product | null>
  save(product: Product): Promise<Product>
  update(id: string, data: UpdateProductPayload): Promise<Product | null>
  delete(id: string): Promise<void>
}
```

### Paso 2: Crear los Use Cases (`core/`)

```typescript
// src/core/products/application/use-cases/create-product.usecase.ts
import type { ProductRepository } from '../../domain/repositories/product.repository'
import type { CreateProductPayload } from '../../domain/types/payloads/create-product.payload'
import type { Product } from '../../domain/entities/product.entity'
import { v4 as uuidv4 } from 'uuid'

export class CreateProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(payload: CreateProductPayload): Promise<Product> {
    const product: Product = {
      id: uuidv4(),
      name: payload.name,
      description: payload.description,
      price: payload.price,
      stock: payload.stock,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return await this.repository.save(product)
  }
}
```

Repetir para: `ListProductsUseCase`, `FindByIdProductUseCase`, `UpdateProductUseCase`, `DeleteProductUseCase`

### Paso 3: Definir el modelo en Prisma (`prisma/schema.prisma`)

```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  description String
  price       Float
  stock       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("products")
}
```

Luego ejecutar:

```bash
pnpm prisma generate
pnpm prisma db push
```

### Paso 4: Implementar el Repositorio Prisma

```typescript
// src/infrastructure/persistence/prisma/products/repositories/product.repository.ts
import type { Product } from '../../../../core/products/domain/entities/product.entity'
import type { UpdateProductPayload } from '../../../../core/products/domain/types/payloads/update-product.payload'
import type { ProductRepository } from '../../../../core/products/domain/repositories/product.repository'
import { prisma } from '../../shared/client'

export class PrismaProductRepository implements ProductRepository {
  async list(offset: number, limit: number): Promise<Product[]> {
    const products = await prisma.product.findMany({
      skip: offset,
      take: limit
    })
    return products.map(p => this.mapToDomain(p))
  }

  async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({ where: { id } })
    if (product == null) return null
    return this.mapToDomain(product)
  }

  async findByEmail(email: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({ where: { email } })
    if (product == null) return null
    return this.mapToDomain(product)
  }

  async save(product: Product): Promise<Product> {
    const created = await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    })
    return this.mapToDomain(created)
  }

  async update(id: string, data: UpdateProductPayload): Promise<Product | null> {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock
      }
    })
    return this.mapToDomain(product)
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } })
  }

  private mapToDomain(prismaProduct: {
    id: string
    name: string
    description: string
    price: number
    stock: number
    createdAt: Date
    updatedAt: Date
  }): Product {
    return {
      id: prismaProduct.id,
      name: prismaProduct.name,
      description: prismaProduct.description,
      price: prismaProduct.price,
      stock: prismaProduct.stock,
      createdAt: prismaProduct.createdAt,
      updatedAt: prismaProduct.updatedAt
    }
  }
}
```

### Paso 5: Crear DTOs (class-validator)

```typescript
// src/interfaces/http/nest/products/schemas/product.dto.ts
import { IsString, IsNumber, IsOptional, IsUUID, IsPositive, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateProductDto {
  @IsString()
  name: string

  @IsString()
  description: string

  @IsNumber()
  @IsPositive()
  price: number

  @IsNumber()
  @Min(0)
  stock: number
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number
}

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  offset?: number

  @IsOptional()
  @Type(() => Number)
  limit?: number
}

export class IdParamDto {
  @IsUUID()
  id: string
}
```

### Paso 6: Crear Controller (NestJS)

```typescript
// src/interfaces/http/nest/products/controllers/products.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, Inject } from '@nestjs/common'
import { ListProductsUseCase } from '../../../../../core/products/application/use-cases/list-products.usecase'
import { CreateProductUseCase } from '../../../../../core/products/application/use-cases/create-product.usecase'
import { FindByIdProductUseCase } from '../../../../../core/products/application/use-cases/find-by-id-product.usecase'
import { UpdateProductUseCase } from '../../../../../core/products/application/use-cases/update-product.usecase'
import { DeleteProductUseCase } from '../../../../../core/products/application/use-cases/delete-product.usecase'
import type { CreateProductPayload } from '../../../../../core/products/domain/types/payloads/create-product.payload'
import type { UpdateProductPayload } from '../../../../../core/products/domain/types/payloads/update-product.payload'
import { CreateProductDto, UpdateProductDto, PaginationQueryDto, IdParamDto } from '../schemas/product.dto'

export const LIST_PRODUCTS_USE_CASE = 'LIST_PRODUCTS_USE_CASE'
export const CREATE_PRODUCT_USE_CASE = 'CREATE_PRODUCT_USE_CASE'
export const FIND_BY_ID_PRODUCT_USE_CASE = 'FIND_BY_ID_PRODUCT_USE_CASE'
export const UPDATE_PRODUCT_USE_CASE = 'UPDATE_PRODUCT_USE_CASE'
export const DELETE_PRODUCT_USE_CASE = 'DELETE_PRODUCT_USE_CASE'

@Controller('api/products')
export class ProductsController {
  constructor(
    @Inject(LIST_PRODUCTS_USE_CASE) private readonly listProductsUseCase: ListProductsUseCase,
    @Inject(CREATE_PRODUCT_USE_CASE) private readonly createProductUseCase: CreateProductUseCase,
    @Inject(FIND_BY_ID_PRODUCT_USE_CASE) private readonly findByIdUseCase: FindByIdProductUseCase,
    @Inject(UPDATE_PRODUCT_USE_CASE) private readonly updateProductUseCase: UpdateProductUseCase,
    @Inject(DELETE_PRODUCT_USE_CASE) private readonly deleteProductUseCase: DeleteProductUseCase
  ) {}

  @Get()
  async list(@Query() query: PaginationQueryDto): Promise<{ data: unknown[] }> {
    const offset = query.offset ?? 0
    const limit = query.limit ?? 10
    const products = await this.listProductsUseCase.execute(offset, limit)
    return { data: products }
  }

  @Get(':id')
  async findById(@Param() params: IdParamDto): Promise<{ data: unknown }> {
    const product = await this.findByIdUseCase.execute(params.id)
    return { data: product }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateProductDto): Promise<{ data: { id: string } }> {
    const payload: CreateProductPayload = {
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock
    }
    const product = await this.createProductUseCase.execute(payload)
    return { data: { id: product.id } }
  }

  @Put(':id')
  async update(@Param() params: IdParamDto, @Body() dto: UpdateProductDto): Promise<{ data: { id: string } }> {
    const payload: UpdateProductPayload = {
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock
    }
    await this.updateProductUseCase.execute(params.id, payload)
    return { data: { id: params.id } }
  }

  @Delete(':id')
  async delete(@Param() params: IdParamDto): Promise<{ data: { id: string } }> {
    await this.deleteProductUseCase.execute(params.id)
    return { data: { id: params.id } }
  }
}
```

### Paso 7: Crear Module (NestJS)

```typescript
// src/interfaces/http/nest/products/modules/products.module.ts
import { Module } from '@nestjs/common'
import type { ProductRepository } from '../../../../../core/products/domain/repositories/product.repository'
import { ListProductsUseCase } from '../../../../../core/products/application/use-cases/list-products.usecase'
import { CreateProductUseCase } from '../../../../../core/products/application/use-cases/create-product.usecase'
import { FindByIdProductUseCase } from '../../../../../core/products/application/use-cases/find-by-id-product.usecase'
import { UpdateProductUseCase } from '../../../../../core/products/application/use-cases/update-product.usecase'
import { DeleteProductUseCase } from '../../../../../core/products/application/use-cases/delete-product.usecase'
import { PrismaProductRepository } from '../../../../../infrastructure/persistence/prisma/products/repositories/product.repository'
import { ProductsController } from '../controllers/products.controller'
import {
  LIST_PRODUCTS_USE_CASE,
  CREATE_PRODUCT_USE_CASE,
  FIND_BY_ID_PRODUCT_USE_CASE,
  UPDATE_PRODUCT_USE_CASE,
  DELETE_PRODUCT_USE_CASE
} from '../controllers/products.controller'

const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY'

@Module({
  controllers: [ProductsController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useFactory: (): ProductRepository => {
        return new PrismaProductRepository()
      }
    },
    {
      provide: LIST_PRODUCTS_USE_CASE,
      useFactory: (productRepository: ProductRepository) => new ListProductsUseCase(productRepository),
      inject: [PRODUCT_REPOSITORY]
    },
    {
      provide: CREATE_PRODUCT_USE_CASE,
      useFactory: (productRepository: ProductRepository) => new CreateProductUseCase(productRepository),
      inject: [PRODUCT_REPOSITORY]
    },
    {
      provide: FIND_BY_ID_PRODUCT_USE_CASE,
      useFactory: (productRepository: ProductRepository) => new FindByIdProductUseCase(productRepository),
      inject: [PRODUCT_REPOSITORY]
    },
    {
      provide: UPDATE_PRODUCT_USE_CASE,
      useFactory: (productRepository: ProductRepository) => new UpdateProductUseCase(productRepository),
      inject: [PRODUCT_REPOSITORY]
    },
    {
      provide: DELETE_PRODUCT_USE_CASE,
      useFactory: (productRepository: ProductRepository) => new DeleteProductUseCase(productRepository),
      inject: [PRODUCT_REPOSITORY]
    }
  ]
})
export class ProductsModule {}
```

### Paso 8: Registrar en AppModule

```typescript
// src/interfaces/http/nest/app.module.ts
import { Module } from '@nestjs/common'
import { UsersModule } from './users/modules/users.module'
import { ProductsModule } from './products/modules/products.module'
import { HealthController } from './health.controller'

@Module({
  imports: [UsersModule, ProductsModule],
  controllers: [HealthController]
})
export class AppModule {}
```

---

## Ejemplo: Entidad "Product"

### Estructura de Archivos Resultante

```
src/
├── core/
│   └── products/
│       ├── domain/
│       │   ├── entities/
│       │   │   └── product.entity.ts
│       │   ├── types/
│       │   │   └── payloads/
│       │   │       ├── create-product.payload.ts
│       │   │       └── update-product.payload.ts
│       │   ├── errors/
│       │   │   └── product-not-found.error.ts
│       │   └── repositories/
│       │       └── product.repository.ts
│       └── application/
│           └── use-cases/
│               ├── create-product.usecase.ts
│               ├── list-products.usecase.ts
│               ├── find-by-id-product.usecase.ts
│               ├── update-product.usecase.ts
│               └── delete-product.usecase.ts
│
├── infrastructure/
│   └── persistence/
│       └── prisma/
│           └── products/
│               └── repositories/
│                   └── product.repository.ts
│
└── interfaces/
    └── http/
        └── nest/
            └── products/
                ├── controllers/
                │   └── products.controller.ts
                ├── modules/
                │   └── products.module.ts
                └── schemas/
                    └── product.dto.ts
```

---

## Configuración de Runtime

### Variables de Entorno

```env
HTTP_RUNTIME=nest
ORM=prisma
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/db
```

### Comandos

```bash
# Desarrollo con Nest + Prisma
make run.dev

# Produccion con Nest + Prisma
make run
```

---

## Resumen de Reglas

1. **Core no conoce nada externo**: No importar Prisma ni NestJS en dominios
2. **Use cases son limpios**: Toda la lógica de negocio va aquí
3. **Repository es una interfaz**: La implementación está en infrastructure
4. **NestJS usa decorators**: `@Controller()`, `@Inject()`, `@Get()`, etc.
5. **Prisma genera cliente**: Siempre ejecutar `pnpm prisma generate` tras cambios
6. **class-validator para DTOs**: Validación declarativa en NestJS
