interface IBaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
  update: (data: any) => IBaseEntity
}

export default IBaseEntity
