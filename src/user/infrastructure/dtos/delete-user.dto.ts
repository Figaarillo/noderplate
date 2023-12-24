import { z } from 'zod'

const DeleteUserDTO = z.object({
  id: z.string().uuid()
})

export default DeleteUserDTO
