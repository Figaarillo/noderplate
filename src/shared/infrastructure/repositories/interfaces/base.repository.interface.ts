import type Nullable from 'src/shared/domain/types/nullable.type'

interface IBaseRepository<Entity> {
  delete: (entityId: string) => Promise<void>
  getAll: () => Promise<Entity[]>
  getBy: (property: Record<string, any>) => Promise<Nullable<Entity>>
  save: (entity: Entity) => Promise<Entity>
  update: (updatedEntity: Entity) => Promise<void>
}

export default IBaseRepository
