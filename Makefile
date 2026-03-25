.PHONY: help install dev build test test.unit test.e2e test.users test.all lint lint.fix format check clean db.migrate db.migrate.create db.migrate.up

# ############ VARIABLES ############ #
DB_HOST?=localhost

# ############# HELP ############ #
help:
	@echo "╭────────────────────────────────────────╮"
	@echo "│           NODERPLATE COMMANDS          │"
	@echo "╰────────────────────────────────────────╯"
	@echo ""
	@echo "  Development:"
	@echo "    make install      - Install dependencies"
	@echo "    make dev          - Run development server"
	@echo "    make build        - Build project"
	@echo "    make clean        - Clean build artifacts"
	@echo ""
	@echo "  Testing:"
	@echo "    make test         - Run all tests"
	@echo "    make test.unit    - Run unit tests"
	@echo "    make test.e2e    - Run e2e tests"
	@echo "    make test.users   - Run users module tests"
	@echo "    make test.all     - Run all tests with coverage"
	@echo ""
	@echo "  Code Quality:"
	@echo "    make lint         - Run ESLint"
	@echo "    make lint.fix     - Run ESLint with auto-fix"
	@echo "    make format       - Format code with Prettier"
	@echo "    make check        - Run all quality checks"
	@echo ""
	@echo "  Database:"
	@echo "    make db.migrate         - Run migrations"
	@echo "    make db.migrate.create  - Create new migration"
	@echo "    make db.migrate.up      - Run pending migrations"

# ############# INSTALL ############ #
install:
	@echo "╭────────────────────────────────────────╮"
	@echo "│         INSTALLING DEPENDENCIES       │"
	@echo "╰────────────────────────────────────────╯"
	pnpm install

# ############# DEV ############ #
dev:
	@echo "╭────────────────────────────────────────╮"
	@echo "│      RUNNING SERVER IN WATCH MODE      │"
	@echo "╰────────────────────────────────────────╯"
	pnpm dev

# ############# BUILD ############ #
build:
	@echo "╭────────────────────────────────────────╮"
	@echo "│             BUILDING PROJECT           │"
	@echo "╰────────────────────────────────────────╯"
	pnpm build

# ############# TESTING ############ #
test:
	@echo "╭────────────────────────────────────────╮"
	@echo "│           RUNNING ALL TESTS            │"
	@echo "╰────────────────────────────────────────╯"
	pnpm test

test.unit:
	@echo "╭────────────────────────────────────────╮"
	@echo "│         RUNNING UNIT TESTS            │"
	@echo "╰────────────────────────────────────────╯"
	pnpm test:unit

test.e2e:
	@echo "╭────────────────────────────────────────╮"
	@echo "│          RUNNING E2E TESTS            │"
	@echo "╰────────────────────────────────────────╯"
	pnpm test:e2e

test.users:
	@echo "╭────────────────────────────────────────╮"
	@echo "│      RUNNING USERS MODULE TESTS       │"
	@echo "╰────────────────────────────────────────╯"
	pnpm vitest run src/tests/users

test.all:
	@echo "╭────────────────────────────────────────╮"
	@echo "│      RUNNING ALL TESTS WITH COVERAGE   │"
	@echo "╰────────────────────────────────────────╯"
	pnpm test:coverage

# ############# LINT & FORMAT ############ #
lint:
	@echo "╭────────────────────────────────────────╮"
	@echo "│            RUNNING ESLINT             │"
	@echo "╰────────────────────────────────────────╯"
	pnpm lint

lint.fix:
	@echo "╭────────────────────────────────────────╮"
	@echo "│         RUNNING ESLINT WITH FIX       │"
	@echo "╰────────────────────────────────────────╯"
	pnpm lint:fix

format:
	@echo "╭────────────────────────────────────────╮"
	@echo "│         FORMATTING CODE               │"
	@echo "╰────────────────────────────────────────╯"
	pnpm prettier

check:
	@echo "╭────────────────────────────────────────╮"
	@echo "│       RUNNING ALL QUALITY CHECKS      │"
	@echo "╰────────────────────────────────────────╯"
	pnpm pre-check

# ############# CLEAN ############ #
clean:
	@echo "╭────────────────────────────────────────╮"
	@echo "│          CLEANING ARTIFACTS           │"
	@echo "╰────────────────────────────────────────╯"
	pnpm clean

# ############# DATABASE ############ #
db.migrate:
	@echo "╭────────────────────────────────────────╮"
	@echo "│           RUNNING MIGRATIONS          │"
	@echo "╰────────────────────────────────────────╯"
	DATABASE_HOST=$(DB_HOST) pnpm db:migrate

db.migrate.create:
	@echo "╭────────────────────────────────────────╮"
	@echo "│          CREATING MIGRATION           │"
	@echo "╰────────────────────────────────────────╯"
	DATABASE_HOST=$(DB_HOST) pnpm mikro-orm migration:create

db.migrate.up:
	@echo "╭────────────────────────────────────────╮"
	@echo "│         APPLYING MIGRATIONS           │"
	@echo "╰────────────────────────────────────────╯"
	DATABASE_HOST=$(DB_HOST) pnpm mikro-orm migration:up
