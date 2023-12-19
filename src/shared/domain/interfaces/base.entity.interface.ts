interface IBaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
  update: (data: IBaseEntity) => IBaseEntity
  create: (data: IBaseEntity) => IBaseEntity
}

export default IBaseEntity
