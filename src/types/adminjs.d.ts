declare module 'adminjs' {
  const AdminJS: any
  export default AdminJS
}

declare module '@adminjs/prisma' {
  export const Database: any
  export const Resource: any
}

declare module '@adminjs/fastify' {
  const AdminJSFastify: any
  export default AdminJSFastify
}
