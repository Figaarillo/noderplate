import type Nullable from '@shared/domain/types/nullable.type'

interface IBaseRepository<Entity> {
  delete: (entityId: string) => Promise<Nullable<Entity>>
  getAll: () => Promise<Entity[]>
  getBy: (property: Record<string, any>) => Promise<Nullable<Entity>>
  save: (entity: Entity) => Promise<Entity>
  update: (updatedEntity: Entity) => Promise<void>
}

export default IBaseRepository
