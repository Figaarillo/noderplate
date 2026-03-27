.PHONY: help run run.dev docker docker.build docker.run docker.run.db docker.stop docker.clean docker.restart.server db.migrate db.migrate.create db.migrate.up db.prisma.generate db.prisma.push db.prisma.migrate db.seed test test.unit test.e2e clean build check lint lint.fix format

# ############ VARIABLES ############ #
DB_HOST?=localhost

help:
	@echo "╭────────────────────────────────────────╮"
	@echo "│              HELP COMMANDS             │"
	@echo "╰────────────────────────────────────────╯"
	@echo ""
	@echo "  Docker:"
	@echo "    make docker          - Build and run all containers"
	@echo "    make docker.build    - Build Docker image"
	@echo "    make docker.run      - Run API server"
	@echo "    make docker.run.db   - Run database container"
	@echo "    make docker.stop     - Stop all containers"
	@echo "    make docker.clean    - Clean containers and volumes"
	@echo "    make docker.restart.server - Restart API server"
	@echo ""
	@echo "  Development:"
	@echo "    make run             - Run server (with migrations and seed)"
	@echo "    make run.dev         - Run development server (watch mode)"
	@echo "    make build           - Build project"
	@echo "    make clean           - Clean build artifacts"
	@echo ""
	@echo "  Database:"
	@echo "    make db.seed         - Seed database with default users"
	@echo ""
	@echo "  Testing:"
	@echo "    make test            - Run all tests"
	@echo "    make test.unit       - Run unit tests"
	@echo "    make test.e2e        - Run e2e tests"
	@echo ""
	@echo "  Database:"
	@echo "    make db.migrate           - Run migrations (MikroORM)"
	@echo "    make db.migrate.create    - Create new migration"
	@echo "    make db.migrate.up        - Apply pending migrations"
	@echo "    make db.prisma.generate   - Generate Prisma client"
	@echo "    make db.prisma.push       - Push schema to DB (dev)"
	@echo "    make db.prisma.migrate    - Apply migrations (prod)"
	@echo ""
	@echo "  Code Quality:"
	@echo "    make lint          - Run ESLint"
	@echo "    make lint.fix      - Run ESLint with auto-fix"
	@echo "    make format        - Format code with Prettier"
	@echo "    make check         - Run all quality checks"

# ############# DOCKER COMMANDS ############ #

docker:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │  BUILDING AND RUNNING ALL CONTAINERS  │ "
	@echo " ╰────────────────────────────────────────╯ "
	docker compose build
	docker compose up -d

docker.build:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │          BUILDING DOCKER IMAGE         │ "
	@echo " ╰────────────────────────────────────────╯ "
	docker compose build

docker.run:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │  RUNNING CONTAINER FOR BACKEND SERVER  │ "
	@echo " ╰────────────────────────────────────────╯ "
	docker compose up -d apiserver

docker.run.db:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │       RUNNING DATABASE CONTAINER      │ "
	@echo " ╰────────────────────────────────────────╯ "
	docker compose up -d database

docker.stop:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │       STOPPING DOCKER CONTAINERS       │ "
	@echo " ╰────────────────────────────────────────╯ "
	docker compose stop

docker.clean:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │       CLEANING DOCKER CONTAINERS       │ "
	@echo " ╰────────────────────────────────────────╯ "
	docker compose down --volumes --remove-orphans

docker.restart.server:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │          RESTARTING APISERVER          │ "
	@echo " ╰────────────────────────────────────────╯ "
	docker compose restart apiserver

# ############# SERVER COMMANDS ############ #

run: docker.run.db
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │       WAITING FOR DATABASE...          │ "
	@echo " ╰────────────────────────────────────────╯ "
	@sleep 3
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │      GENERATING PRISMA CLIENT          │ "
	@echo " ╰────────────────────────────────────────╯ "
	pnpm prisma:generate
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │           RUNNING MIGRATIONS            │ "
	@echo " ╰────────────────────────────────────────╯ "
	pnpm prisma:migrate
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │         SEEDING DATABASE               │ "
	@echo " ╰────────────────────────────────────────╯ "
	pnpm seed
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │             RUNNING SERVER             │ "
	@echo " ╰────────────────────────────────────────╯ "
	DATABASE_HOST=$(DB_HOST) pnpm start

run.dev: docker.run.db
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │       WAITING FOR DATABASE...          │ "
	@echo " ╰────────────────────────────────────────╯ "
	@sleep 3
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │      GENERATING PRISMA CLIENT          │ "
	@echo " ╰────────────────────────────────────────╯ "
	pnpm prisma:generate
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │           RUNNING MIGRATIONS            │ "
	@echo " ╰────────────────────────────────────────╯ "
	pnpm prisma:push
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │         SEEDING DATABASE               │ "
	@echo " ╰────────────────────────────────────────╯ "
	pnpm seed
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │      RUNNING SERVER IN WATCH MODE      │ "
	@echo " ╰────────────────────────────────────────╯ "
	DATABASE_HOST=$(DB_HOST) pnpm dev

# ############# DATABASE COMMANDS ############ #

db.migrate:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │           RUNNING MIGRATIONS           │ "
	@echo " ╰────────────────────────────────────────╯ "
	DATABASE_HOST=$(DB_HOST) pnpm db:migrate

db.migrate.create:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │          CREATING MIGRATION            │ "
	@echo " ╰────────────────────────────────────────╯ "
	DATABASE_HOST=$(DB_HOST) pnpm mikro-orm migration:create

db.migrate.up:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │         APPLYING MIGRATIONS            │ "
	@echo " ╰────────────────────────────────────────╯ "
	DATABASE_HOST=$(DB_HOST) pnpm mikro-orm migration:up

db.prisma.generate:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │      GENERATING PRISMA CLIENT          │ "
	@echo " ╰────────────────────────────────────────╯ "
	pnpm prisma:generate

db.prisma.push:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │      PUSHING SCHEMA TO DATABASE        │ "
	@echo " ╰────────────────────────────────────────╯ "
	pnpm prisma:push

db.prisma.migrate:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │      APPLYING PRISMA MIGRATIONS        │ "
	@echo " ╰────────────────────────────────────────╯ "
	pnpm prisma:migrate

db.seed:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │         SEEDING DATABASE               │ "
	@echo " ╰────────────────────────────────────────╯ "
	pnpm seed

# ############# TEST COMMANDS ############ #

test:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │           RUNNING ALL TESTS            │ "
	@echo " ╰────────────────────────────────────────╯ "
	pnpm test

test.unit:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │         RUNNING ALL UNIT TESTS         │ "
	@echo " ╰────────────────────────────────────────╯ "
	pnpm test:unit

test.e2e:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │         RUNNING ALL E2E TESTS          │ "
	@echo " ╰────────────────────────────────────────╯ "
	pnpm test:e2e

# ############# BUILD COMMANDS ############ #

build:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │             BUILDING PROJECT           │ "
	@echo " ╰────────────────────────────────────────╯ "
	pnpm build

clean:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │          CLEANING ARTIFACTS             │ "
	@echo " ╰────────────────────────────────────────╯ "
	pnpm clean

# ############# CODE QUALITY ############ #

lint:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │              RUNNING LINT              │ "
	@echo " ╰────────────────────────────────────────╯ "
	pnpm lint

lint.fix:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │           RUNNING LINT FIX             │ "
	@echo " ╰────────────────────────────────────────╯ "
	pnpm lint:fix

format:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │           FORMATTING CODE              │ "
	@echo " ╰────────────────────────────────────────╯ "
	pnpm prettier

check:
	@echo " ╭────────────────────────────────────────╮ "
	@echo " │       RUNNING ALL QUALITY CHECKS       │ "
	@echo " ╰────────────────────────────────────────╯ "
	pnpm pre-check