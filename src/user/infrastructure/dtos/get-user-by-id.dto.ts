import { z } from 'zod'
import { idDTO } from './dto-types/dto-types'

const GetUserByIdDTO = z.object({
  id: idDTO
})

export default GetUserByIdDTO
