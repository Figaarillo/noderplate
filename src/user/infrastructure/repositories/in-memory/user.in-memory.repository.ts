import type Nullable from '@shared/domain/types/nullable.type'
import type UserEntity from '@user/domain/entities/user.entity'
import type UserPayload from '@user/domain/payload/user.payload'
import type UserRepository from '@user/domain/repository/user.repository'

class UserInMemoryRepository implements UserRepository {
  private readonly userData: UserEntity[] = []

  async List(): Promise<UserEntity[]> {
    return this.userData
  }

  async GetByID(id: string): Promise<Nullable<UserEntity>> {
    const user = this.userData.find(user => user.id === id)
    if (user == null) {
      return null
    }

    return user
  }

  async getByName(name: string): Promise<Nullable<UserEntity>> {
    const user = this.userData.find(user => user.firstName === name)
    if (user == null) {
      return null
    }

    return user
  }

  async Save(user: UserEntity): Promise<UserEntity> {
    this.userData.push(user)

    return user
  }

  async delete(id: string): Promise<Nullable<void>> {
    const indexToDelete = this.userData.findIndex(entity => entity.id === id)

    if (indexToDelete === -1) {
      return null
    }

    this.userData.splice(indexToDelete, 1)
  }

  async update(id: string, user: UserPayload): Promise<Nullable<void>> {
    const userToUpdate = this.userData.find(user => {
      if (user.id === id) {
        return user
      }

      return user
    })

    if (userToUpdate == null) {
      return null
    }

    userToUpdate.update(user)
  }
}

export default UserInMemoryRepository
