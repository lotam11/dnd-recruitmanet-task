export type Resolver<T> = () => Promise<T>;

export type CacheGetInterface<T> = { resolve: ( resolve: Resolver<T>) => Promise<T> }

export interface ICacheService {
  set: <T>(id: any, data: T) => T
  get: <T>(id: any) => CacheGetInterface<T> 
  remove: (id: any) => any
  storeBulk: <T>(array: Array<T>, resolveKey: (obj: T) => any) => any
}