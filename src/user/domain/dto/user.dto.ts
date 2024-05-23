interface UserDTO {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: number
  city: string
  province: string
  country: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export default UserDTO
