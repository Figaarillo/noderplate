import type IBaseEntity from 'src/shared/domain/interfaces/base.entity.interface'
import type IBaseRepository from '../interfaces/base.repository.interface'
import type Nullable from 'src/shared/domain/types/nullable.type'

class BaseInMemoryRepository<Entity extends IBaseEntity> implements IBaseRepository<Entity> {
  private readonly entityData: Entity[] = []

  async delete(entityId: string): Promise<void> {
    this.entityData.filter(entity => entity.id !== entityId)
  }

  async getAll(): Promise<Entity[]> {
    const entity = this.entityData

    return entity
  }

  async getBy(property: Record<string, any>): Promise<Nullable<Entity>> {
    const propertyKey = Object.keys(property)[0]

    const entityFoundByProperty: Entity | undefined = this.entityData.find(entity => {
      return entity[propertyKey as keyof typeof entity] === property[propertyKey]
    })

    if (entityFoundByProperty === undefined) return null

    return entityFoundByProperty
  }

  async save(entity: Entity): Promise<Entity> {
    this.entityData.push(entity)

    return entity
  }

  async update(updatedEntity: Entity): Promise<void> {
    this.entityData.map(entityStored => {
      if (entityStored.id === updatedEntity.id) {
        return updatedEntity
      }

      return entityStored
    })
  }
}

export default BaseInMemoryRepository
