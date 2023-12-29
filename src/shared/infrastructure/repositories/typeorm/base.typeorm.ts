import type BaseModel from '@shared/infrastructure/models/base.model'
import type IBaseRepository from '../interfaces/base.repository.interface'
import type Nullable from '@shared/domain/types/nullable.type'

class BaseTypeORMRepository<Entity extends BaseModel> implements IBaseRepository<Entity> {
  delete!: (entityId: string) => Promise<Nullable<Entity>>
  getAll!: () => Promise<Entity[]>
  getBy!: (property: Record<string, any>) => Promise<Nullable<Entity>>
  save!: (entity: Entity) => Promise<Entity>
  update!: (updatedEntity: Entity) => Promise<void>
}

export default BaseTypeORMRepository
