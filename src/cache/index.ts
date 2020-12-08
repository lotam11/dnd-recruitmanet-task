export type Resolver<T> = () => Promise<T>;

export type CacheGetInterface = { resolve: <T>( resolve: Resolver<T>) => Promise<T> }

export interface ICacheService {
  set: <T>(id: any, data: T) => T
  get: (id: any) => CacheGetInterface 
  remove: (id: any) => any
  storeBulk: <T>(array: Array<T>, resolveKey: (obj: T) => any) => any
}