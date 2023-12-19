import type IBaseEntity from 'src/shared/domain/interfaces/base.entity.interface'
import type IBaseRepository from '../interfaces/base.repository.interface'
import type Nullable from 'src/shared/domain/types/nullable.type'

class BaseInMemoryRepository<Entity extends IBaseEntity> implements IBaseRepository<Entity> {
  private entityData: Entity[] = []

  async getAll(): Promise<Entity[]> {
    const entity = this.entityData

    return entity
  }

  async save(entity: Entity): Promise<Entity> {
    this.entityData.push(entity)

    return entity
  }

  async getBy(property: string): Promise<Nullable<Entity>> {
    const entityFoundByProperty: any = this.entityData.find(
      (entity: any) => entity[property] === property
    )

    if (entityFoundByProperty === undefined) return null

    return entityFoundByProperty
  }

  async update(updatedEntity: Entity): Promise<void> {
    this.entityData.map(entityStored => {
      if (entityStored.id === updatedEntity.id) {
        return updatedEntity
      }

      return entityStored
    })
  }

  async delete(entity: Entity): Promise<void> {
    const entities = this.entityData.filter(entityStored => {
      return entityStored.id !== entity.id
    })

    this.entityData = entities
  }
}

export default BaseInMemoryRepository
