type AttributesOnly<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : T[K]
}

export default AttributesOnly
