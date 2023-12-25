/* eslint-disable no-console */
import UserController from '@user/adapter/user.controller'
import type UpdateUserPayload from '@user/domain/payloads/update-user.payload'
import type UserPayload from '@user/domain/payloads/user.payload'

const userPayload: UserPayload = {
  firstName: 'Axel',
  lastName: 'Leonardi',
  phoneNumber: 12342134,
  email: 'zZLw2@example.com',
  password: '1029Test.'
}

const userPayload2: UserPayload = {
  firstName: 'Axel',
  lastName: 'Leonardi',
  phoneNumber: 12342134,
  email: 'zZLw2@example.com',
  password: '1029Test.'
}

const userPayload3: UserPayload = {
  firstName: 'Axel',
  lastName: 'Leonardi',
  phoneNumber: 12342134,
  email: 'zZLw2@example.com',
  password: '1029Test.'
}

const userPayload4: UserPayload = {
  firstName: 'Axel',
  lastName: 'Leonardi',
  phoneNumber: 12342134,
  email: 'zZLw2@example.com',
  password: '1029Test.'
}

;(async (): Promise<void> => {
  const userController = new UserController()

  // #### Create User ####
  console.log('#### Create User ####')

  const userCreated = await userController.registerUser(userPayload)
  console.log({ userCreated })

  // #### Delete User ####
  console.log('\n#### Delete User ####')
  const userToDelete = await userController.registerUser(userPayload2)
  console.log({ userToDelete })

  const userDeleted = await userController.deleteUser(userToDelete.id)
  console.log({ userDeleted })

  // #### Update User ####
  console.log('\n#### Update User ####')
  const userToUpdate = await userController.registerUser(userPayload3)
  const newPayload: UpdateUserPayload = {
    id: userToUpdate.id,
    firstName: 'newname',
    lastName: 'newlastname',
    phoneNumber: 92342434,
    email: 'zZLw2@example.com',
    password: '1029Test.'
  }
  const userUpdated = await userController.updateUser(newPayload)
  console.log({ userUpdated })

  // #### Get User ####
  console.log('\n#### Get User ####')
  const userCreated2 = await userController.registerUser(userPayload4)
  console.log({ userCreated2 })

  const userFound = await userController.getUserById(userCreated2.id)
  console.log({ userFound })

  console.log('\n🚀 ~ file: server.ts:run')
})()
