/* eslint-disable no-console */
import CreateUser from '@user/aplication/use-cases/create-user.usecase'
import DeleteUser from '@user/aplication/use-cases/delete-user.usecase'
import GetUser from '@user/aplication/use-cases/get-user.usecase'
import UpdateUser from '@user/aplication/use-cases/update-user.usecase'
import type UpdateUserPayload from '@user/domain/payloads/update-user.payload'
import type UserPayload from '@user/domain/payloads/user.payload'
import UserInMemoryRepository from '@user/infrastructure/repositories/in-memory/user.in-memory.repository'

const userPayload: UserPayload = {
  firstName: 'Axel',
  lastName: 'Leonardi',
  phoneNumber: 12342134,
  email: 'zZLw2@example.com',
  password: '12345678'
}

const userPayload2: UserPayload = {
  firstName: 'Name2',
  lastName: 'lastName2',
  phoneNumber: 12342134,
  email: 'zZLw2@example.com',
  password: '12345678'
}

const userPayload3: UserPayload = {
  firstName: 'firtsName3',
  lastName: 'lastName3',
  phoneNumber: 12342134,
  email: 'zZLw2@example.com',
  password: '12345678'
}

const userPayload4: UserPayload = {
  firstName: 'firstName4',
  lastName: 'lastName4',
  phoneNumber: 12342134,
  email: 'zZLw2@example.com',
  password: '12345678'
}

;(async (): Promise<void> => {
  const repository = new UserInMemoryRepository()
  const createUser = new CreateUser(repository)
  const deleteUser = new DeleteUser(repository)
  const getUser = new GetUser(repository)
  const updateUser = new UpdateUser(repository)

  // #### Create User ####
  console.log('#### Create User ####')

  const userCreated = await createUser.exec(userPayload)
  console.log({ userCreated })

  // #### Delete User ####
  console.log('#### Delete User ####')
  const userToDelete = await createUser.exec(userPayload2)
  console.log({ userToDelete })

  await deleteUser.exec(userToDelete.id.value)
  const userFound = await getUser.exec(userToDelete.id.value)
  if (userFound != null) {
    console.log({ userFound })
  } else {
    console.log('User was not found')
  }

  // #### Update User ####
  console.log('#### Update User ####')
  const userToUpdate = await createUser.exec(userPayload3)
  const newPayload: UpdateUserPayload = {
    id: userToUpdate.id.value,
    firstName: 'new name',
    lastName: 'new last name',
    phoneNumber: 134234234,
    email: 'zZLw2@example.com',
    password: '12345678'
  }
  const userUpdated = await updateUser.exec(newPayload)
  console.log({ userUpdated })

  // #### Get User ####
  console.log('#### Get User ####')
  const userCreated2 = await createUser.exec(userPayload4)
  console.log({ userCreated2 })

  if (userCreated2 == null) {
    console.log('User was not found')
  } else {
    console.log({ userCreated2 })
  }

  console.log('\n🚀 ~ file: server.ts:run')
})()
