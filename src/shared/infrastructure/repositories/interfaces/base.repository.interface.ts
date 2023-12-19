import type Nullable from 'src/shared/domain/types/nullable.type'

interface IBaseRepository<Entity> {
  getAll: () => Promise<Entity[]>
  save: (entity: Entity) => Promise<Entity>
  getBy: (property: string) => Promise<Nullable<Entity>>
  update: (updatedEntity: Entity) => Promise<void>
  delete: (entityId: string) => Promise<void>
}

export default IBaseRepository
