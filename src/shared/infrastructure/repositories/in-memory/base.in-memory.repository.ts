import type IBaseEntity from '@shared/domain/interfaces/base.entity.interface'
import type Nullable from '@shared/domain/types/nullable.type'
import type IBaseRepository from '../interfaces/base.repository.interface'

class BaseInMemoryRepository<Entity extends IBaseEntity> implements IBaseRepository<Entity> {
  private entityData: Entity[] = []

  async delete(entityId: string): Promise<void> {
    this.entityData = this.entityData.filter(entity => entity.id.value !== entityId)
  }

  async getAll(): Promise<Entity[]> {
    const entity = this.entityData

    return entity
  }

  async getBy(property: Record<string, any>): Promise<Nullable<Entity>> {
    const [propertyKey] = Object.keys(property)
    const [propertyValue] = Object.values(property)

    const entityFoundByProperty: Entity | undefined = this.entityData.find(entity => {
      return (entity as any)[propertyKey]?.value === propertyValue
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
      if (entityStored.id.value === updatedEntity.id.value) {
        return updatedEntity
      }

      return entityStored
    })
  }
}

export default BaseInMemoryRepository
