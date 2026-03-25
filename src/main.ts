import { bootstrapApplication } from './app/bootstrap/bootstrap-application'

async function main(): Promise<void> {
  const app = await bootstrapApplication()
  await app.start()
}

main().catch(error => {
  console.error('Fatal bootstrap error:', error)
  process.exit(1)
})
