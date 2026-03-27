const { readFileSync, writeFileSync, existsSync } = require('fs')
const { join } = require('path')

const PROJECT_ROOT = process.cwd()
const ENV_FILE = join(PROJECT_ROOT, '.env')
const BOOTSTRAP_DIR = join(PROJECT_ROOT, 'src/app/bootstrap')
const BOOTSTRAP_APPLICATION = join(BOOTSTRAP_DIR, 'bootstrap-application.ts')

function log(message) {
  console.log('[select-runtime] ' + message)
}

function error(message) {
  console.error('[select-runtime] ERROR: ' + message)
  process.exit(1)
}

function updateEnvFile(key, value) {
  if (!existsSync(ENV_FILE)) {
    error('.env file not found')
  }

  let content = readFileSync(ENV_FILE, 'utf-8')
  const regex = new RegExp('^' + key + '=.*', 'm')

  if (regex.test(content)) {
    content = content.replace(regex, key + '=' + value)
  } else {
    content += '\n' + key + '=' + value
  }

  writeFileSync(ENV_FILE, content)
  log('Updated .env: ' + key + '=' + value)
}

function updateBootstrapApplication(runtime) {
  if (!existsSync(BOOTSTRAP_APPLICATION)) {
    log('bootstrap-application.ts not found, skipping')
    return
  }

  const template = `import { env } from '../config/env'

interface AppRuntime {
  start: () => Promise<void>
}

export async function bootstrapApplication(): Promise<AppRuntime> {
  if (env.httpRuntime === '${runtime}') {
    const { create${capitalize(runtime)}Runtime } = await import('./${runtime}.bootstrap')
    return await create${capitalize(runtime)}Runtime()
  } else {
    throw new Error(\`Unsupported HTTP runtime: \${env.httpRuntime}\`)
  }
}
`

  writeFileSync(BOOTSTRAP_APPLICATION, template)
  log('Updated bootstrap-application.ts for ' + runtime)
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function setHttpRuntime(runtime) {
  log('Setting HTTP runtime to: ' + runtime)

  updateEnvFile('HTTP_RUNTIME', runtime)

  const bootstrapFile = join(BOOTSTRAP_DIR, runtime + '.bootstrap.ts')
  if (!existsSync(bootstrapFile)) {
    error('Bootstrap file not found: ' + bootstrapFile + '. Make sure the bootstrap file exists.')
  }

  updateBootstrapApplication(runtime)

  log('HTTP runtime set to ' + runtime)
  log('')
  log('Note: Both HTTP frameworks are still available in the codebase.')
  log('Only the default runtime has been changed.')
}

function setOrm(orm) {
  log('Setting ORM to: ' + orm)

  updateEnvFile('ORM', orm)

  log('ORM set to ' + orm)
  log('')
  log('Note: Both ORMs are still available in the codebase.')
  log('Only the default ORM has been changed.')
}

function printUsage() {
  console.log(`
Usage: node scripts/select-runtime.cjs [options]

Options:
  --http <runtime>   Set HTTP runtime (nest, fastify)
  --orm <orm>       Set ORM (prisma, mikroorm)
  --help            Show this help message

Examples:
  node scripts/select-runtime.cjs --http nest --orm prisma
  node scripts/select-runtime.cjs --http fastify
  node scripts/select-runtime.cjs --orm mikroorm
  `)
}

function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help')) {
    printUsage()
    process.exit(0)
  }

  let httpRuntime = null
  let orm = null

  const SUPPORTED_HTTP = ['nest', 'fastify']
  const SUPPORTED_ORMS = ['prisma', 'mikroorm']

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === '--http' && i + 1 < args.length) {
      const value = args[++i].toLowerCase()
      if (!SUPPORTED_HTTP.includes(value)) {
        error('Unsupported HTTP runtime: ' + value + '. Supported: ' + SUPPORTED_HTTP.join(', '))
      }
      httpRuntime = value
    }

    if (arg === '--orm' && i + 1 < args.length) {
      const value = args[++i].toLowerCase()
      if (!SUPPORTED_ORMS.includes(value)) {
        error('Unsupported ORM: ' + value + '. Supported: ' + SUPPORTED_ORMS.join(', '))
      }
      orm = value
    }
  }

  if (!httpRuntime && !orm) {
    error('Please specify at least one option: --http or --orm')
  }

  if (httpRuntime) {
    setHttpRuntime(httpRuntime)
  }

  if (orm) {
    setOrm(orm)
  }

  log('')
  log('========================================')
  log('Runtime selection complete!')
  log('========================================')
  log('Run "pnpm build" to verify the project compiles correctly.')
}

main()
