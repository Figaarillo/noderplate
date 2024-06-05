interface IUserEntity {
  id: string
  createdAt: Date
  updatedAt: Date
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: number
  city: string
  province: string
  country: string
  role: string
}

export default IUserEntity
