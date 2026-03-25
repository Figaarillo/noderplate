export interface User {
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

export interface CreateUserInput {
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

export interface UpdateUserInput {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: number
  city?: string
  province?: string
  country?: string
  role?: string
}
