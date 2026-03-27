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

export const adminJsConfig = {
  adminJs,
  auth: {
    cookieName: 'adminjs',
    cookiePassword: process.env.ADMIN_COOKIE_PASSWORD ?? 'secret-cookie-password-change-in-production'
  },
  sessionSecret: process.env.ADMIN_SESSION_SECRET ?? 'secret-session-secret-change-in-production'
}
