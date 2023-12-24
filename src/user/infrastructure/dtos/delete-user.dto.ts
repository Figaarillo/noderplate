import { z } from 'zod'
import { idDTO } from './dto-types/dto-types'

const DeleteUserDTO = z.object({
  id: idDTO
})

export default DeleteUserDTO
