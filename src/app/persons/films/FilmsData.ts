import {QueryBuilder} from 'knex';
import { ICacheService } from '../../../cache';
import {DataClient} from '../../../data/DataProvider';

export interface PersonFilm {
  title: string,
  description: string,
  release_date?: string,
  id: number
}

export const getPersonFilm = (users: () => QueryBuilder, cache: ICacheService) => 
  async (id: string) => {
    return cache
      .get(id)
      .resolve(async() =>
        (await users().select().where({id}))[0] as PersonFilm
      )
  } 

export const createPersonFilm = (users: () => QueryBuilder, cache: ICacheService) => 
  async (input?: PersonFilm) => {
    const result = (await users().insert(input, ['id']))[0] as number;
    const [row] = await users().select().where({id: result});
    return cache.set(
      result,
      row
    );
  }


export const updatePersonFilm = (users: () => QueryBuilder, cache: ICacheService) => 
  async (input: PersonFilm) => {
    const {id, ...rest} = input;
    await users().where({id}).update(rest);

    return await cache.set(
      id,
      await users().select().where({id})
    );
  }

export const deletePersonFilm = (users: () => QueryBuilder, cache: ICacheService) => 
  async (id : number) => {
    await users()
      .where({id})
      .delete()
      .then(() => cache.remove(id)); 
  }

interface PersonFilmQueryParameters {
  offset: number | null,
  limit: number | null
}

export const getPersonFilmList = (personfilms: () => QueryBuilder, cache: ICacheService) => 
  async (parameters: PersonFilmQueryParameters) => {
    let query = personfilms().select();
    
    if(parameters.offset)
      query = query.where("id", ">", parameters.offset);
    
    if(parameters.limit)
      query = query.limit(parameters.limit);

    const result = await query as PersonFilm[]
    
    cache.storeBulk(result, (obj) => obj.id);

    return result;
  }

 
export interface Data {
  get: ReturnType<typeof getPersonFilm>,
  getList: ReturnType<typeof getPersonFilmList>,
  create: ReturnType<typeof createPersonFilm>,
  update: ReturnType<typeof updatePersonFilm>
  delete: ReturnType<typeof deletePersonFilm>
}

export async function create (
  data: DataClient,
  cache: ICacheService
): Promise<Data> {
  const users = () => data.mysql.table('personfilm')

  return {
    get: getPersonFilm(users, cache),
    getList: getPersonFilmList(users, cache),
    create: createPersonFilm(users, cache),
    update: updatePersonFilm(users, cache),
    delete: deletePersonFilm(users, cache)
  }
}
