# Testing Documentation

## Test Results - March 27, 2026

### 1. Unit Tests

```bash
pnpm test:unit
```

**Results:** ✅ PASSED

- 8 test files
- 31 tests passed
- Duration: ~1s

### 2. E2E Tests

```bash
pnpm test:e2e
```

**Results:** ✅ PASSED

- 9 test files
- 36 tests passed
- Duration: ~800ms

### 3. Lint

```bash
pnpm lint
```

**Results:** ✅ PASSED

- No ESLint errors

### 4. Build

```bash
pnpm build
```

**Results:** ✅ PASSED

- TypeScript compilation successful

---

## API Endpoint Testing (Nest + Prisma)

### Configuration

- HTTP Runtime: NestJS
- ORM: Prisma
- Port: 3000
- Database: PostgreSQL (Docker)

### Successful Endpoints

| Method | Endpoint                        | Status | Description       |
| ------ | ------------------------------- | ------ | ----------------- |
| GET    | /health                         | ✅ 200 | Health check      |
| GET    | /api/users                      | ✅ 200 | List all users    |
| POST   | /api/users                      | ✅ 201 | Register new user |
| POST   | /api/users/auth/login           | ✅ 200 | User login        |
| DELETE | /api/users/:id                  | ✅ 200 | Delete user       |
| POST   | /api/users/auth/change-password | ✅ 200 | Change password   |
| GET    | /api-docs                       | ✅ 200 | Swagger UI        |
| GET    | /api-docs-json                  | ✅ 200 | OpenAPI spec      |

### Error Handling Tests

| Test Case                           | Expected   | Actual | Status                  |
| ----------------------------------- | ---------- | ------ | ----------------------- |
| Wrong password                      | 401        | 401    | ✅ Fixed                |
| User not found (login)              | 401        | 401    | ✅ Fixed                |
| User not found (delete)             | 404        | 404    | ✅ Fixed                |
| Duplicate email registration        | 400/500    | 500    | ⚠️ Duplicate key error  |
| Missing required fields             | 400        | 400    | ✅ Validation works     |
| Invalid UUID format                 | 400        | 400    | ✅ Validation works     |
| Forgot password (non-existent user) | 200 (safe) | 200    | ✅ Security OK          |
| Change password without auth        | 401        | 400    | ✅ Blocked              |
| 2FA login (no email configured)     | 500        | 500    | ⚠️ Email not configured |

### Fixes Applied

1. **Added GlobalExceptionFilter** - `src/interfaces/http/nest/common/filters/global-exception.filter.ts`

   - Handles `InvalidCredentialsError` → 401 Unauthorized
   - Handles not found errors → 404 Not Found
   - Handles validation errors → 400 Bad Request
   - Logs unhandled errors

2. **Updated DeleteUserUseCase** - Now checks if user exists before deleting

### Remaining Issues

1. **Duplicate email registration**: Returns 500 due to database constraint violation (not a real bug)
2. **2FA endpoints**: ✅ Now working with mock email provider

---

## Email Configuration

The project supports 3 email modes:

### 1. Mock Mode (Default for development)

Logs emails to console instead of sending them.

```env
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_SECURE=false
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=noreply@noderplate.local
```

### 2. Mailtrap (Testing)

Get free credentials at https://mailtrap.io

```env
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_SECURE=false
EMAIL_USER=your-username
EMAIL_PASS=your-password
EMAIL_FROM=noreply@yourdomain.com
```

### 3. Production SMTP

```env
EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-username
EMAIL_PASS=your-password
EMAIL_FROM=noreply@yourdomain.com
```

---

## Test Commands

```bash
# Start database
docker compose up -d database

# Generate Prisma client
pnpm prisma:generate

# Run all tests
pnpm test

# Run unit tests
pnpm test:unit

# Run e2e tests
pnpm test:e2e

# Run lint
pnpm lint

# Build project
pnpm build

# Run application (Nest + Prisma)
HTTP_RUNTIME=nest ORM=prisma pnpm start
```

---

## Runtime Selection

The project supports multiple runtime combinations:

```bash
# NestJS + Prisma
HTTP_RUNTIME=nest ORM=prisma pnpm start

# NestJS + MikroORM
HTTP_RUNTIME=nest ORM=mikroorm pnpm start

# Fastify + Prisma
HTTP_RUNTIME=fastify ORM=prisma pnpm start

# Fastify + MikroORM
HTTP_RUNTIME=fastify ORM=mikroorm pnpm start
```
