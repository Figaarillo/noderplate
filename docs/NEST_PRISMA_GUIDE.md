# Guía de Conceptos: NestJS y Prisma para Desarrolladores Fastify/Express

Este documento explica los conceptos clave de NestJS y Prisma comparándolos con lo que ya conoces de Fastify y Express.

---

## Tabla de Contenidos

1. [NestJS vs Express/Fastify](#nestjs-vs-expressfastify)
2. [Arquitectura de NestJS](#arquitectura-de-nestjs)
3. [Inyección de Dependencias](#inyección-de-dependencias)
4. [Decoradores](#decoradores)
5. [Módulos](#módulos)
6. [Pipes y Validación](#pipes-y-validación)
7. [Prisma vs ORM Tradicional](#prisma-vs-orm-tradicional)
8. [Conceptos Clave de Prisma](#conceptos-clave-de-prisma)

---

## NestJS vs Express/Fastify

### Enfoque

| Aspecto        | Express/Fastify             | NestJS                           |
| -------------- | --------------------------- | -------------------------------- |
| **Enfoque**    | Minimalista, vos armás todo | Framework completo, opinionated  |
| **Estructura** | Libre, depends de vos       | Estructura obligatoria (módulos) |
| **Rutas**      | `app.get('/ruta', handler)` | Decoradores `@Get('/ruta')`      |
| **Middleware** | Funciones con `next()`      | Funciones o Guards/Interceptors  |
| **DI**         | Manual o第三方              | IOC Container nativo             |

### Equivalencias Basic

```typescript
// Express/Fastify
app.get('/users', async (req, res) => {
  const users = await userService.findAll()
  res.send(users)
})

// NestJS equivalent
@Controller('/users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll()
  }
}
```

### Inicialización

```typescript
// Express
const app = express()
app.listen(3000)

// Fastify
const app = fastify()
await app.listen({ port: 3000 })

// NestJS
const app = await NestFactory.create(AppModule)
await app.listen(3000)
```

---

## Arquitectura de NestJS

NestJS sigue una arquitectura similar a Angular. La estructura es:

```
┌─────────────────────────────────────────┐
│              Application                 │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │             Module                 │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │      Controller            │  │  │ ← Maneja HTTP requests
│  │  │  @Get @Post @Put @Delete   │  │  │
│  │  └─────────────────────────────┘  │  │
│  │                                     │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │     Provider/Service       │  │  │ ← Lógica de negocio
│  │  │  @Injectable()             │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Analogía con tu código actual

Tu estructura actual con Fastify:

```
AppContainer (tu DI manual)
  → Controllers (tu código Fastify)
  → UseCases (tu lógica)
  → Repositories (tu acceso a datos)
```

NestJS ofrece esto nativamente:

```
Nest Container (DI nativo)
  → Controllers (@Controller)
  → Services (@Injectable)
  → Repositories (@Injectable)
```

---

## Inyección de Dependencias (DI)

### Tu approach actual (Fastify)

```typescript
// Tu código actual - container manual
const userRepository = new PrismaUserRepository()
const listUsersUseCase = new ListUsersUseCase(userRepository)
const controller = new UserController({ listUsers })

container.controllers = { userController: controller }
```

### NestJS approach (DI automático)

```typescript
// NestJS - declarativo
@Module({
  providers: [
    {
      provide: 'USER_REPOSITORY', // Token
      useFactory: () => new PrismaUserRepository() // Cómo crear
    },
    {
      provide: ListUsersUseCase, // Usa la clase como token
      useFactory: repo => new ListUsersUseCase(repo),
      inject: ['USER_REPOSITORY'] // Qué inyectar
    }
  ]
})
export class UsersModule {}
```

### Usar en el Controller

```typescript
@Controller('users')
export class UsersController {
  constructor(@Inject(ListUsersUseCase) private readonly listUseCase: ListUsersUseCase) {}

  @Get()
  async findAll() {
    return this.listUseCase.execute()
  }
}
```

### Pattern Provider en NestJS

```typescript
// provider = "recipe" for creating something
{
  provide: 'TOKEN_NAME',
  useFactory: () => new MiClase()
}

// o más simple con classes
{
  provide: MiServicio,
  useClass: MiServicioImpl  // Si hay interfaz
}
```

---

## Decoradores

Los decoradores son la forma principal de configurar NestJS. Son funciones que "decoran" clases con metadata.

### Decoradores de Controller

```typescript
@Controller('users') // Define ruta base
export class UsersController {
  @Get() // GET /users
  findAll() {}

  @Get(':id') // GET /users/:id
  findById(@Param() params) {}

  @Post() // POST /users
  create(@Body() dto) {}

  @Put(':id') // PUT /users/:id
  update(@Param() params, @Body() dto) {}

  @Delete(':id') // DELETE /users/:id
  delete(@Param() params) {}
}
```

### Decoradores de Parameter

```typescript
@Controller('users')
export class UsersController {
  @Get(':id')
  findById(
    @Param('id') id: string, // URL param
    @Query('page') page: number, // Query string
    @Body() dto: CreateUserDto, // Body
    @Headers('authorization') auth: string // Headers
  ) {}
}
```

### Decoradores de Inyección

```typescript
constructor(
  @Inject('REPOSITORY') private readonly repo,      // Por string token
  @Inject(UserService) private readonly service,    // Por class
  @Inject(forwardRef(() => AuthService)) private auth // Forward reference
) {}
```

### Decorador @Injectable

```typescript
@Injectable() // Puedo inyectar esta clase en otras
export class UserService {
  constructor(private readonly repo: UserRepository) {}
}
```

---

## Módulos

Los módulos son la forma de organizar el código en NestJS.

### Module Básico

```typescript
@Module({
  imports: [], // Otros módulos que necesito
  controllers: [], // Controllers de este módulo
  providers: [] // Servicios/Providers de este módulo
})
export class MiModulo {}
```

### Ejemplo: UsersModule

```typescript
@Module({
  controllers: [UsersController],
  providers: [UserService, { provide: 'REPO', useFactory: () => new PrismaRepo() }]
})
export class UsersModule {}
```

### Module Raíz (AppModule)

```typescript
@Module({
  imports: [UsersModule, ProductsModule, AuthModule]
})
export class AppModule {}
```

### Module vs Tu Estructura Actual

| Tu estructura         | NestJS equivalente       |
| --------------------- | ------------------------ |
| `src/features/users/` | `UsersModule`            |
| Controllers Fastify   | `@Controller()`          |
| Use Cases             | `@Injectable()` Services |
| Repositories          | `@Injectable()` Services |

---

## Pipes y Validación

En Express/Fastify hacés validación con middleware Zod:

```typescript
// Tu código Fastify con Zod
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

app.post('/users', async (req, res) => {
  new SchemaValidator(createUserSchema, req.body).validate()
  // ...
})
```

En NestJS usás **Pipes** con **class-validator**:

### DTO con class-validator

```typescript
// src/users/dto/create-user.dto.ts
export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string

  @IsString()
  firstName: string
}
```

### Habilitar validación global

```typescript
// En bootstrap
app.useGlobalPipes(
  new ValidationPipe({
    transform: true, // Convierte types a clases
    whitelist: true, // Remove properties sin decorador
    forbidNonWhitelisted: true // Error si hay props extra
  })
)
```

### Equivalencia Zod → class-validator

| Zod                  | class-validator             |
| -------------------- | --------------------------- |
| `z.string()`         | `@IsString()`               |
| `z.string().email()` | `@IsEmail()`                |
| `z.string().min(8)`  | `@MinLength(8)`             |
| `z.number()`         | `@IsNumber()`               |
| `z.object({...})`    | `@ValidateNested()` + class |
| `.optional()`        | `@IsOptional()`             |

---

## Prisma vs ORM Tradicional

### ¿Qué es Prisma?

Prisma es un ORM con enfoque diferente a los tradicionales:

| Aspecto         | TypeORM/Sequelize         | Prisma                        |
| --------------- | ------------------------- | ----------------------------- |
| **Definición**  | Decoradores/Configuración | Schema declarativo            |
| **Queries**     | QueryBuilder/API          | Query builder + tipos seguros |
| **Migraciones** | CLI del ORM               | `prisma migrate`              |
| **Cliente**     | Instancia de clase        | Cliente generado              |

### Tu esquema actual (Prisma)

```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

### Equivalencia con MikroORM

```typescript
// MikroORM - Entity con decorators
@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  id: string

  @Property()
  email: string

  @Property()
  name: string
}
```

### Usar Prisma Client

```typescript
// import cliente singleton
import { prisma } from '../shared/client'

// Queries son promesas normales
const users = await prisma.user.findMany()

const user = await prisma.user.create({
  data: {
    email: 'test@test.com',
    name: 'Test'
  }
})

await prisma.user.update({
  where: { id: 'uuid' },
  data: { name: 'Updated' }
})

await prisma.user.delete({
  where: { id: 'uuid' }
})
```

---

## Conceptos Clave de Prisma

### Schema-Driven

El archivo `schema.prisma` es la fuente de verdad:

1. Definís modelos ahí
2. Ejecutás `prisma generate` → genera cliente TypeScript con tipos
3. Usás el cliente en tu código

```bash
# Flujo de trabajo
1. Editar schema.prisma
2. pnpm prisma generate    # Regenerar cliente
3. pnpm prisma db push     # Sincronizar DB (dev)
4. pnpm prisma migrate    # Migración (prod)
```

### Modelo vs Entidad

| Concepto          | Descripción                          |
| ----------------- | ------------------------------------ |
| **Prisma Model**  | Definición en `schema.prisma`        |
| **Prisma Entity** | No existe tal cosa                   |
| **Prisma Client** | Objeto para hacer queries (generado) |

### Queries Tipicas

```typescript
// Find one
await prisma.user.findUnique({ where: { id: 'uuid' } })
await prisma.user.findUnique({ where: { email: 'a@b.com' } })

// Find many
await prisma.user.findMany({
  where: { role: 'admin' },
  skip: 10,
  take: 20,
  orderBy: { createdAt: 'desc' }
})

// Create
await prisma.user.create({
  data: { email: 'a@b.com', name: 'Test' }
})

// Update
await prisma.user.update({
  where: { id: 'uuid' },
  data: { name: 'New Name' }
})

// Delete
await prisma.user.delete({ where: { id: 'uuid' } })

// Upsert
await prisma.user.upsert({
  where: { email: 'a@b.com' },
  update: { name: 'Updated' },
  create: { email: 'a@b.com', name: 'Created' }
})
```

### Relación con tu Arquitectura

```
Tu código actual:
  UseCase → Repository Interface → PrismaProductRepository → prisma.product.*
                              └─> prisma client

El repositorio encapsula el acceso:
- No exponés Prisma directamente
- Retorna tipos del dominio
- Mantiene clean separation
```

---

## Resumen de Conceptos

### NestJS

| Concepto                  | Para qué sirve                    |
| ------------------------- | --------------------------------- |
| `@Controller()`           | Definir ruta base y manejar HTTP  |
| `@Injectable()`           | Marcar clase como inyectable      |
| `@Module()`               | Agrupar funcionalidad relacionada |
| `@Get()`, `@Post()`, etc. | Definir endpoints                 |
| `ValidationPipe`          | Validar DTOs automáticamente      |
| `@Inject()`               | Inyectar dependencias por token   |

### Prisma

| Concepto                 | Para qué sirve                 |
| ------------------------ | ------------------------------ |
| `schema.prisma`          | Definir modelos de DB          |
| `prisma generate`        | Generar cliente TypeScript     |
| `prisma db push`         | Sincronizar schema (dev)       |
| `prisma migrate`         | Migraciones controladas (prod) |
| `prisma.user.findMany()` | Query API                      |

### Diferencia Principal con Fastify

| Fastify                                  | NestJS                                 |
| ---------------------------------------- | -------------------------------------- |
| Manual: creás container, registrás rutas | Automático: IOC container, decoradores |
| Middleware functions                     | Guards, Interceptors, Pipes            |
| Zod para validación                      | class-validator + Pipes                |
| Registro manual de rutas                 | Auto-discovery via decoradores         |

---

## Próximos Pasos

1. Revisa `src/interfaces/http/nest/users/` para ver ejemplo completo
2. Revisa `prisma/schema.prisma` para ver modelo
3. Revisa `src/infrastructure/persistence/prisma/` para ver implementación
4. Ejecuta `make run.dev` y probá los endpoints con curl
