import { any } from "joi";
import NodeCache from "node-cache"
import { ICacheService, Resolver, CacheGetInterface } from ".";

export const set = (cache: NodeCache) =>
  <T>(id: any, data: T): T => {
    cache.set(id, data);
    return data;
  }

export const get = (cache: NodeCache) =>
  (id: any): CacheGetInterface => {
    const value = cache.get(id);

    if ( value === undefined ) 
      return {
        resolve: async <T>(resolve: Resolver<T>): Promise<T> => {
          const result = await resolve();
          cache.set(id, result);
          return result
        }
      }
    
    return {
      resolve: async <T>(resolve: Resolver<T>): Promise<T> =>
        value as T
    }
  }

export const remove = (cache: NodeCache) =>
  (id: any) => {
    cache.del(id);
  }

export const storeBulk = (cache: NodeCache) =>
  <T>(array: Array<T>, resolveKey: (obj: T) => any) => {
    const bulk: Array<any> = array.map((val: T) => ({
      key: resolveKey(val),
      val
    }));
    cache.mset(bulk);
  }


export const create = (config: NodeCache.Options): ICacheService => {
  const cache = new NodeCache(config);
  return {
    set: set(cache),
    get: get(cache),
    remove: remove(cache),
    storeBulk: storeBulk(cache)
  }
} 