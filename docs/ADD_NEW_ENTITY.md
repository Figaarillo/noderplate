# Guía para Agregar una Nueva Entidad

Esta guía documenta el proceso completo para agregar una nueva entidad al proyecto siguiendo la arquitectura hexagonal.

## Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Flujo de una Solicitud](#flujo-de-una-solicitud)
3. [Pasos para Agregar una Entidad](#pasos-para-agregar-una-entidad)
4. [Ejemplo Completo: Entidad "Product"](#ejemplo-completo-entidad-product)
5. [Configuración de Runtimes](#configuración-de-runtimes)

---

## Arquitectura General (Vertical Slicing)

Este proyecto utiliza **Vertical Slicing** donde cada feature es autocontenida y tiene todo lo que necesita para funcionar de forma independiente.

```
src/
├── main.ts                           # Entry point
│
├── app/                             # Composición de la aplicación
│   ├── bootstrap/                   # Bootstrap (Fastify/Nest)
│   ├── config/                     # Configuración de entorno
│   └── container/                 # DI Container
│
├── features/                       # VERTICAL SLICES (features autocontenidas)
│   └── users/                     # Feature "users"
│       ├── domain/                 # Lógica de negocio pura (sin dependencias externas)
│       │   ├── entities/          # Entidades del dominio
│       │   ├── errors/            # Errores específicos del dominio
│       │   ├── payloads/          # DTOs del dominio
│       │   └── repositories/      # Interfaces de repositorio (puertos)
│       │
│       ├── application/            # Casos de uso
│       │   └── use-cases/         # Create, List, FindById, Update, Delete
│       │
│       ├── infrastructure/          # Implementaciones de infraestructura
│       │   ├── mikro-orm/         # MikroORM adapter
│       │   │   ├── config/        # Configuración
│       │   │   ├── entities/      # Entidades MikroORM
│       │   │   ├── migrations/    # Migraciones
│       │   │   └── repositories/  # Repositorio MikroORM
│       │   └── prisma/            # Prisma adapter
│       │       ├── client.ts       # Cliente Prisma
│       │       └── repositories/   # Repositorio Prisma
│       │
│       └── interfaces/            # Adaptadores HTTP
│           ├── fastify/            # Fastify adapter
│           │   ├── controllers/   # Controladores Fastify
│           │   ├── dtos/         # DTOs Zod
│           │   ├── middlewares/    # Middlewares
│           │   └── routes/        # Rutas
│           └── nest/              # NestJS adapter
│               ├── dto/           # DTOs class-validator
│               ├── providers/     # Providers DI
│               └── module/        # Módulos Nest
│
└── shared/                        # Código compartido entre features
    ├── contracts/                  # Interfaces/contratos compartidos
    │   └── security/             # Contracts de hash y token
    ├── errors/                   # Errores compartidos
    ├── types/                    # Tipos compartidos
    └── infrastructure/           # Infraestructura compartida
        ├── persistence/          # CLI de migraciones
        └── security/            # Implementaciones de seguridad
```

### Principios Clave

1. **Cada feature es independiente**: Contiene su dominio, casos de uso, infraestructura e interfaces
2. **Core sin dependencias externas**: El dominio no conoce a MikroORM, Prisma, Fastify ni NestJS
3. **Infraestructura pluggable**: Cada feature puede usar MikroORM o Prisma sin afectar otras features
4. **Interfaces autodocumentadas**: Cada feature tiene sus propios adaptadores HTTP

---

## Flujo de una Solicitud

### Fastify + MikroORM

```
POST /api/products
    │
    ▼
┌─────────────────┐
│ user.route.ts   │  → Registra rutas en Fastify
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Controller      │  → Recibe use cases inyectados
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Use Case        │  → Lógica de negocio pura
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Repository      │  → Interfaz definida en core/
│ (MikroORM impl) │     Implementación en infrastructure/
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ MikroORM Entity │  → Mapeo ORM → Dominio
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ PostgreSQL      │
└─────────────────┘
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
// src/core/products/domain/payloads/create-product.payload.ts
export interface CreateProductPayload {
  name: string
  description: string
  price: number
  stock: number
}

// src/core/products/domain/payloads/update-product.payload.ts
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
import type { CreateProductPayload } from '../payloads/create-product.payload'
import type { UpdateProductPayload } from '../payloads/update-product.payload'

export interface ProductRepository {
  list(offset: number, limit: number): Promise<Product[]>
  findById(id: string): Promise<Product | null>
  save(product: Product): Promise<Product>
  update(id: string, data: UpdateProductPayload): Promise<Product | null>
  delete(id: string): Promise<void>
}
```

### Paso 2: Crear los Use Cases (`core/`)

```typescript
// src/core/products/application/use-cases/create-product.usecase.ts
import type { ProductRepository } from '../../domain/repositories/product.repository'
import type { CreateProductPayload } from '../../domain/payloads/create-product.payload'
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

```typescript
// src/core/products/application/use-cases/list-products.usecase.ts
import type { ProductRepository } from '../../domain/repositories/product.repository'
import type { Product } from '../../domain/entities/product.entity'

export class ListProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(offset: number, limit: number): Promise<Product[]> {
    return await this.repository.list(offset, limit)
  }
}
```

```typescript
// src/core/products/application/use-cases/find-by-id-product.usecase.ts
import type { ProductRepository } from '../../domain/repositories/product.repository'
import type { Product } from '../../domain/entities/product.entity'
import { ProductNotFoundError } from '../../domain/errors/product-not-found.error'

export class FindByIdProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(id: string): Promise<Product> {
    const product = await this.repository.findById(id)
    if (product == null) {
      throw new ProductNotFoundError()
    }
    return product
  }
}
```

```typescript
// src/core/products/application/use-cases/update-product.usecase.ts
import type { ProductRepository } from '../../domain/repositories/product.repository'
import type { UpdateProductPayload } from '../../domain/payloads/update-product.payload'
import type { Product } from '../../domain/entities/product.entity'
import { ProductNotFoundError } from '../../domain/errors/product-not-found.error'

export class UpdateProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(id: string, payload: UpdateProductPayload): Promise<Product> {
    const product = await this.repository.update(id, payload)
    if (product == null) {
      throw new ProductNotFoundError()
    }
    return product
  }
}
```

```typescript
// src/core/products/application/use-cases/delete-product.usecase.ts
import type { ProductRepository } from '../../domain/repositories/product.repository'
import { ProductNotFoundError } from '../../domain/errors/product-not-found.error'

export class DeleteProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(id: string): Promise<void> {
    const product = await this.repository.findById(id)
    if (product == null) {
      throw new ProductNotFoundError()
    }
    await this.repository.delete(id)
  }
}
```

### Paso 3: Implementar el Repositorio (Infrastructure)

#### Opción A: MikroORM

```typescript
// src/infrastructure/persistence/mikro-orm/entities/product.entity.ts
import { Entity, PrimaryKey, Property, DateTimeType } from '@mikro-orm/core'

@Entity({ tableName: 'products' })
export class ProductMikroORM {
  @PrimaryKey()
  id!: string

  @Property()
  name!: string

  @Property()
  description!: string

  @Property()
  price!: number

  @Property()
  stock!: number

  @Property({ type: DateTimeType })
  createdAt!: Date

  @Property({ type: DateTimeType, onUpdate: () => new Date() })
  updatedAt!: Date
}
```

```typescript
// src/infrastructure/persistence/mikro-orm/repositories/product.repository.ts
import type { EntityManager } from '@mikro-orm/core'
import type { Product } from '../../../../core/products/domain/entities/product.entity'
import type { CreateProductPayload } from '../../../../core/products/domain/payloads/create-product.payload'
import type { UpdateProductPayload } from '../../../../core/products/domain/payloads/update-product.payload'
import type { ProductRepository } from '../../../../core/products/domain/repositories/product.repository'
import { ProductMikroORM } from '../entities/product.entity'

export class MikroORMProductRepository implements ProductRepository {
  constructor(private readonly em: EntityManager) {}

  async list(offset: number, limit: number): Promise<Product[]> {
    const products = await this.em.find(ProductMikroORM, {}, { offset, limit })
    return products.map(p => this.mapToDomain(p))
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.em.findOne(ProductMikroORM, { id })
    if (product == null) return null
    return this.mapToDomain(product)
  }

  async save(product: Product): Promise<Product> {
    const orm = this.mapToORM(product)
    await this.em.persistAndFlush(orm)
    return this.mapToDomain(orm)
  }

  async update(id: string, data: UpdateProductPayload): Promise<Product | null> {
    const product = await this.em.findOne(ProductMikroORM, { id })
    if (product == null) return null

    Object.assign(product, data)
    product.updatedAt = new Date()
    await this.em.flush()

    return this.mapToDomain(product)
  }

  async delete(id: string): Promise<void> {
    const product = await this.em.findOne(ProductMikroORM, { id })
    if (product != null) {
      await this.em.removeAndFlush(product)
    }
  }

  private mapToDomain(orm: ProductMikroORM): Product {
    return {
      id: orm.id,
      name: orm.name,
      description: orm.description,
      price: orm.price,
      stock: orm.stock,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt
    }
  }

  private mapToORM(product: Product): ProductMikroORM {
    const orm = new ProductMikroORM()
    orm.id = product.id
    orm.name = product.name
    orm.description = product.description
    orm.price = product.price
    orm.stock = product.stock
    orm.createdAt = product.createdAt
    orm.updatedAt = product.updatedAt
    return orm
  }
}
```

#### Opción B: Prisma

```prisma
// src/infrastructure/persistence/prisma/schema.prisma (agregar al final)

model Product {
  id          String   @id @default(uuid())
  name        String
  description String
  price       Float
  stock       Int      @default(0)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("products")
}
```

```typescript
// src/infrastructure/persistence/prisma/repositories/product.repository.ts
import type { Product } from '../../../../core/products/domain/entities/product.entity'
import type { UpdateProductPayload } from '../../../../core/products/domain/payloads/update-product.payload'
import type { ProductRepository } from '../../../../core/products/domain/repositories/product.repository'
import { prisma } from '../client'

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

### Paso 4: Crear DTOs para Fastify (Zod)

```typescript
// src/interfaces/http/shared/dto-types/product.dto-types.ts
import { z } from 'zod'

export const nameDTO = z.string().min(1, { message: 'Name is required' })
export const descriptionDTO = z.string().optional()
export const priceDTO = z.number().positive({ message: 'Price must be positive' })
export const stockDTO = z.number().int().nonnegative({ message: 'Stock must be a non-negative integer' })

// src/interfaces/http/fastify/dtos/product.dto.ts
import { z } from 'zod'
import { nameDTO, descriptionDTO, priceDTO, stockDTO } from '../../shared/dto-types/product.dto-types'

export const CreateProductDTO = z.object({
  name: nameDTO,
  description: descriptionDTO,
  price: priceDTO,
  stock: stockDTO
})

export const UpdateProductDTO = z.object({
  name: nameDTO.optional(),
  description: descriptionDTO.optional(),
  price: priceDTO.optional(),
  stock: stockDTO.optional()
})

export const CheckIdDTO = z.object({
  id: z.string().uuid({ message: 'ID must be a valid UUID' })
})
```

### Paso 5: Crear Controller para Fastify

```typescript
// src/interfaces/http/fastify/controllers/product.controller.ts
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { ListProductsUseCase } from '../../../../core/products/application/use-cases/list-products.usecase'
import type { CreateProductUseCase } from '../../../../core/products/application/use-cases/create-product.usecase'
import type { FindByIdProductUseCase } from '../../../../core/products/application/use-cases/find-by-id-product.usecase'
import type { UpdateProductUseCase } from '../../../../core/products/application/use-cases/update-product.usecase'
import type { DeleteProductUseCase } from '../../../../core/products/application/use-cases/delete-product.usecase'
import type { CreateProductPayload } from '../../../../core/products/domain/payloads/create-product.payload'
import type { UpdateProductPayload } from '../../../../core/products/domain/payloads/update-product.payload'

export interface PaginationQuery {
  offset?: string
  limit?: string
}

export interface IdParams {
  id: string
}

export interface ProductControllerDeps {
  listProducts: ListProductsUseCase
  createProduct: CreateProductUseCase
  findById: FindByIdProductUseCase
  updateProduct: UpdateProductUseCase
  deleteProduct: DeleteProductUseCase
}

export class ProductController {
  constructor(private readonly deps: ProductControllerDeps) {}

  async list(req: FastifyRequest<{ Querystring: PaginationQuery }>, res: FastifyReply): Promise<void> {
    const offset = parseInt(req.query.offset ?? '0')
    const limit = parseInt(req.query.limit ?? '10')

    const products = await this.deps.listProducts.execute(offset, limit)
    res.status(200).send({ data: products })
  }

  async findById(req: FastifyRequest<{ Params: IdParams }>, res: FastifyReply): Promise<void> {
    const product = await this.deps.findById.execute(req.params.id)
    res.status(200).send({ data: product })
  }

  async create(req: FastifyRequest<{ Body: CreateProductPayload }>, res: FastifyReply): Promise<void> {
    const product = await this.deps.createProduct.execute(req.body)
    res.status(201).send({ data: { id: product.id } })
  }

  async update(
    req: FastifyRequest<{ Params: IdParams; Body: UpdateProductPayload }>,
    res: FastifyReply
  ): Promise<void> {
    await this.deps.updateProduct.execute(req.params.id, req.body)
    res.status(200).send({ data: { id: req.params.id } })
  }

  async delete(req: FastifyRequest<{ Params: IdParams }>, res: FastifyReply): Promise<void> {
    await this.deps.deleteProduct.execute(req.params.id)
    res.status(200).send({ data: { id: req.params.id } })
  }
}
```

### Paso 6: Crear Rutas para Fastify

```typescript
// src/interfaces/http/fastify/routes/product.route.ts
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { AppContainer } from '../../../../app/container/types'
import type { CreateProductPayload } from '../../../../core/products/domain/payloads/create-product.payload'
import type { UpdateProductPayload } from '../../../../core/products/domain/payloads/update-product.payload'
import type { PaginationQuery, IdParams } from '../controllers/product.controller'
import { CreateProductDTO, UpdateProductDTO, CheckIdDTO } from '../dtos/product.dto'
import { SchemaValidator } from '../middlewares/zod-schema-validator.middleware'

export function registerProductRoutes(app: FastifyInstance, container: AppContainer): void {
  const controller = container.controllers.productController

  app.get('/api/products', async (req: FastifyRequest, res: FastifyReply) => {
    await controller.list(req as FastifyRequest<{ Querystring: PaginationQuery }>, res)
  })

  app.get('/api/products/:id', async (req: FastifyRequest, res: FastifyReply) => {
    new SchemaValidator(CheckIdDTO, req.params).validate()
    await controller.findById(req as FastifyRequest<{ Params: IdParams }>, res)
  })

  app.post('/api/products', async (req: FastifyRequest, res: FastifyReply) => {
    new SchemaValidator(CreateProductDTO, req.body).validate()
    await controller.create(req as FastifyRequest<{ Body: CreateProductPayload }>, res)
  })

  app.put('/api/products/:id', async (req: FastifyRequest, res: FastifyReply) => {
    new SchemaValidator(CheckIdDTO, req.params).validate()
    new SchemaValidator(UpdateProductDTO, req.body).validate()
    await controller.update(req as FastifyRequest<{ Params: IdParams; Body: UpdateProductPayload }>, res)
  })

  app.delete('/api/products/:id', async (req: FastifyRequest, res: FastifyReply) => {
    new SchemaValidator(CheckIdDTO, req.params).validate()
    await controller.delete(req as FastifyRequest<{ Params: IdParams }>, res)
  })
}
```

### Paso 7: Crear DTOs para NestJS (class-validator)

```typescript
// src/interfaces/http/nest/products/dto/product.dto.ts
import { IsString, IsNumber, IsOptional, IsUUID, IsPositive, Min } from 'class-validator'

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
  offset?: number

  @IsOptional()
  limit?: number
}

export class IdParamDto {
  @IsUUID()
  id: string
}
```

### Paso 8: Crear Controller para NestJS

```typescript
// src/interfaces/http/nest/products/products.controller.ts
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, Inject } from '@nestjs/common'
import { ListProductsUseCase } from '../../../../core/products/application/use-cases/list-products.usecase'
import { CreateProductUseCase } from '../../../../core/products/application/use-cases/create-product.usecase'
import { FindByIdProductUseCase } from '../../../../core/products/application/use-cases/find-by-id-product.usecase'
import { UpdateProductUseCase } from '../../../../core/products/application/use-cases/update-product.usecase'
import { DeleteProductUseCase } from '../../../../core/products/application/use-cases/delete-product.usecase'
import type { CreateProductPayload } from '../../../../core/products/domain/payloads/create-product.payload'
import type { UpdateProductPayload } from '../../../../core/products/domain/payloads/update-product.payload'
import { CreateProductDto, UpdateProductDto, PaginationQueryDto, IdParamDto } from './dto/product.dto'
import {
  LIST_PRODUCTS_USE_CASE,
  CREATE_PRODUCT_USE_CASE,
  FIND_BY_ID_PRODUCT_USE_CASE,
  UPDATE_PRODUCT_USE_CASE,
  DELETE_PRODUCT_USE_CASE
} from './products.providers'

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

### Paso 9: Crear Providers y Module para NestJS

```typescript
// src/features/products/interfaces/nest/providers/products.providers.ts
export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY'
export const LIST_PRODUCTS_USE_CASE = 'LIST_PRODUCTS_USE_CASE'
export const CREATE_PRODUCT_USE_CASE = 'CREATE_PRODUCT_USE_CASE'
export const FIND_BY_ID_PRODUCT_USE_CASE = 'FIND_BY_ID_PRODUCT_USE_CASE'
export const UPDATE_PRODUCT_USE_CASE = 'UPDATE_PRODUCT_USE_CASE'
export const DELETE_PRODUCT_USE_CASE = 'DELETE_PRODUCT_USE_CASE'
```

```typescript
// src/features/products/interfaces/nest/module/products.module.ts
import { Module } from '@nestjs/common'
import type { ProductRepository } from '../../../domain/repositories/product.repository'
import { ListProductsUseCase } from '../../../application/use-cases/list-products.usecase'
import { CreateProductUseCase } from '../../../application/use-cases/create-product.usecase'
import { FindByIdProductUseCase } from '../../../application/use-cases/find-by-id-product.usecase'
import { UpdateProductUseCase } from '../../../application/use-cases/update-product.usecase'
import { DeleteProductUseCase } from '../../../application/use-cases/delete-product.usecase'
import { PrismaProductRepository } from '../../../infrastructure/prisma/repositories/product.repository'
import { ProductsController } from '../products.controller'
import {
  PRODUCT_REPOSITORY,
  LIST_PRODUCTS_USE_CASE,
  CREATE_PRODUCT_USE_CASE,
  FIND_BY_ID_PRODUCT_USE_CASE,
  UPDATE_PRODUCT_USE_CASE,
  DELETE_PRODUCT_USE_CASE
} from '../providers/products.providers'

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

### Paso 10: Registrar en el Container (Fastify)

```typescript
// src/app/container/register-products.ts
import type { AppContainer } from './types'
import { ProductController } from '../../features/products/interfaces/fastify/controllers/product.controller'
import { ListProductsUseCase } from '../../features/products/application/use-cases/list-products.usecase'
import { CreateProductUseCase } from '../../features/products/application/use-cases/create-product.usecase'
import { FindByIdProductUseCase } from '../../features/products/application/use-cases/find-by-id-product.usecase'
import { UpdateProductUseCase } from '../../features/products/application/use-cases/update-product.usecase'
import { DeleteProductUseCase } from '../../features/products/application/use-cases/delete-product.usecase'

export function registerProducts(container: AppContainer): void {
  const productRepository = container.repositories.productRepository

  const listProducts = new ListProductsUseCase(productRepository)
  const createProduct = new CreateProductUseCase(productRepository)
  const findById = new FindByIdProductUseCase(productRepository)
  const updateProduct = new UpdateProductUseCase(productRepository)
  const deleteProduct = new DeleteProductUseCase(productRepository)

  const controller = new ProductController({
    listProducts,
    createProduct,
    findById,
    updateProduct,
    deleteProduct
  })

  container.controllers.productController = controller
}
```

### Paso 11: Actualizar Tipos del Container

```typescript
// src/app/container/types.ts
import type { EntityManager, MikroORM } from '@mikro-orm/core'
import type { ProductRepository } from '../../features/products/domain/repositories/product.repository'
import type { UserRepository } from '../../features/users/domain/repositories/user.repository'
import type { ProductController } from '../../features/products/interfaces/fastify/controllers/product.controller'
import type { UserController } from '../../features/users/interfaces/fastify/controllers/user.controller'

export interface AppContainer {
  orm: MikroORM
  em: EntityManager
  repositories: {
    userRepository: UserRepository
    productRepository: ProductRepository // Agregar
  }
  controllers: {
    userController: UserController
    productController: ProductController // Agregar
  }
}
```

### Paso 12: Actualizar register-infrastructure

```typescript
// src/app/container/register-infrastructure.ts
import { MikroORM } from '@mikro-orm/core'
import mikroORMConfig from '../../features/users/infrastructure/mikro-orm/config/mikro-orm.config'
import type { AppContainer } from './types'

export async function registerInfrastructure(container: AppContainer): Promise<void> {
  const orm = await MikroORM.init(mikroORMConfig)
  const em = orm.em.fork()

  container.orm = orm
  container.em = em

  // User Repository
  const { MikroORMUserRepository } = await import(
    '../../features/users/infrastructure/mikro-orm/repositories/user.repository'
  )

  // Product Repository
  const { MikroORMProductRepository } = await import(
    '../../features/products/infrastructure/mikro-orm/repositories/product.repository'
  )

  container.repositories = {
    userRepository: new MikroORMUserRepository(em),
    productRepository: new MikroORMProductRepository(em)
  }
}
```

### Paso 13: Actualizar build-container

```typescript
// src/app/container/build-container.ts
import { createContainer } from './types'
import type { AppContainer } from './types'
import { registerInfrastructure } from './register-infrastructure'
import { registerUsers } from './register-users'
import { registerProducts } from './register-products' // Agregar

export async function buildContainer(): Promise<AppContainer> {
  const container = createContainer()

  await registerInfrastructure(container)
  registerUsers(container)
  registerProducts(container) // Agregar

  return container
}
```

### Paso 14: Actualizar Rutas en Fastify Bootstrap

```typescript
// src/app/bootstrap/fastify.bootstrap.ts
import type { FastifyInstance } from 'fastify'
import { registerUserRoutes } from '../../features/users/interfaces/fastify/routes/user.route'
import { registerProductRoutes } from '../../features/products/interfaces/fastify/routes/product.route' // Agregar
import type { AppContainer } from '../container/types'
import { env } from '../config/env'

export async function createFastifyRuntime(container: AppContainer): Promise<{ start: () => Promise<void> }> {
  const app: FastifyInstance = (await import('fastify')).default()

  registerUserRoutes(app, container)
  registerProductRoutes(app, container) // Agregar

  return {
    async start() {
      await app.listen({ port: env.port, host: '0.0.0.0' })
      // eslint-disable-next-line no-console
      console.log(`Server listening at http://0.0.0.0:${env.port}`)
      // eslint-disable-next-line no-console
      console.log('Server is running! Go to http://localhost:' + env.port)
    }
  }
}
```

### Paso 15: Actualizar AppModule de NestJS

```typescript
// src/features/products/interfaces/nest/module/app.module.ts
import { Module } from '@nestjs/common'
import { UsersModule } from './users.module'
import { ProductsModule } from '../products/module/products.module' // Agregar

@Module({
  imports: [UsersModule, ProductsModule] // Agregar
})
export class AppModule {}
```

### Paso 16: Generar Migración (MikroORM)

```bash
# Para MikroORM
pnpm mikro-orm migration:create --initial

# Para Prisma
npx prisma db push --schema=./src/features/products/infrastructure/prisma/schema.prisma
```

---

## Ejemplo Completo: Entidad "Product"

### Estructura de Archivos Resultante (Vertical Slice)

```
src/
└── features/
    └── products/                          # Feature autocontenida
        ├── domain/                         # Lógica de negocio pura
        │   ├── entities/
        │   │   └── product.entity.ts
        │   ├── payloads/
        │   │   ├── create-product.payload.ts
        │   │   └── update-product.payload.ts
        │   ├── errors/
        │   │   └── product-not-found.error.ts
        │   └── repositories/
        │       └── product.repository.ts   # Puerto/Interfaz
        │
        ├── application/                  # Casos de uso
        │   └── use-cases/
        │       ├── create-product.usecase.ts
        │       ├── list-products.usecase.ts
        │       ├── find-by-id-product.usecase.ts
        │       ├── update-product.usecase.ts
        │       └── delete-product.usecase.ts
        │
        ├── infrastructure/              # Implementaciones
        │   ├── mikro-orm/               # MikroORM adapter
        │   │   ├── config/
        │   │   │   └── mikro-orm.config.ts
        │   │   ├── entities/
        │   │   │   └── product.entity.ts
        │   │   ├── migrations/
        │   │   └── repositories/
        │   │       └── product.repository.ts
        │   └── prisma/                 # Prisma adapter
        │       ├── schema.prisma
        │       ├── client.ts
        │       └── repositories/
        │           └── product.repository.ts
        │
        └── interfaces/                  # Adaptadores HTTP
            ├── fastify/                # Fastify adapter
            │   ├── controllers/
            │   │   └── product.controller.ts
            │   ├── dtos/
            │   │   └── product.dto.ts
            │   └── routes/
            │       └── product.route.ts
            └── nest/                   # NestJS adapter
                ├── dto/
                │   └── product.dto.ts
                ├── providers/
                │   └── product.providers.ts
                └── module/
                    └── product.module.ts

# Nota: shared/ contiene código compartido entre features
# ├── shared/
# │   ├── contracts/security/      # Contratos compartidos
# │   ├── errors/                 # Errores compartidos
# │   └── infrastructure/        # Infraestructura compartida
```

---

## Configuración de Runtimes

### Variables de Entorno

```env
# Runtime HTTP
HTTP_RUNTIME=fastify  # o "nest"

# ORM
ORM=mikroorm  # o "prisma"

# Base de datos
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=tu_usuario
DATABASE_PASS=tu_password
DATABASE_NAME=noderplate
DATABASE_URL=postgresql://tu_usuario:tu_password@localhost:5432/noderplate
```

### Comandos para Probar

```bash
# Fastify + MikroORM (default)
pnpm dev

# NestJS + Prisma
HTTP_RUNTIME=nest ORM=prisma pnpm dev

# NestJS + MikroORM
HTTP_RUNTIME=nest ORM=mikroorm pnpm dev

# Fastify + Prisma
HTTP_RUNTIME=fastify ORM=prisma pnpm dev
```

---

## Resumen de Reglas

1. **Core no conoce nada externo**: No importar MikroORM, Prisma, Fastify ni NestJS
2. **Infrastructure implementa puertos**: Solo conoce las interfaces del core
3. **Interfaces convierten**: Transforman entre el mundo externo y el dominio
4. **App orquesta**: Conecta infrastructure con interfaces
5. **Use cases son limpios**: Toda la lógica de negocio va aquí
6. **Repository es una interfaz**: La implementación está en infrastructure

---

## Testing

Los use cases se prueban con mocks del repository:

```typescript
// src/tests/products/unit/create.usecase.test.ts
import { describe, it, expect, vi } from 'vitest'
import { CreateProductUseCase } from '../../../../features/products/application/use-cases/create-product.usecase'

const mockRepository = {
  list: vi.fn(),
  findById: vi.fn(),
  save: vi.fn().mockResolvedValue({
    id: '123',
    name: 'Test',
    description: 'Desc',
    price: 100,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  }),
  update: vi.fn(),
  delete: vi.fn()
}

describe('CreateProductUseCase', () => {
  it('should create a product', async () => {
    const useCase = new CreateProductUseCase(mockRepository)
    const result = await useCase.execute({ name: 'Test', description: 'Desc', price: 100, stock: 10 })

    expect(result.name).toBe('Test')
    expect(mockRepository.save).toHaveBeenCalled()
  })
})
```
