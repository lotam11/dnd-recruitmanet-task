import {QueryBuilder} from 'knex';
import { ICacheService } from '../../../cache';
import {DataClient} from '../../../data/DataProvider';
import {Data as PersonData} from "../PersonData";

export interface PersonFilm {
  title: string,
  description: string,
  release_date?: string,
  id: number
  person_id: number
}

export const getPersonFilm = (users: () => QueryBuilder, cache: ICacheService) => 
  async (id: number, person_id: number) => {
    const result = await cache
      .get(id)
      .resolve(async() =>
        (await users().select().where({id}))[0] as PersonFilm
      );
      return (result.person_id == person_id)? result: null
  } 

export const createPersonFilm = (
  users: () => QueryBuilder,
  perosns: PersonData,
  cache: ICacheService
) => 
  async (input: PersonFilm, person_id: string) => {
    if(!! perosns.get(person_id))
      return;
    const result = (await users().insert(input, ['id']))[0] as number;
    const [row] = await users().select().where({id: result});
    return cache.set(
      result,
      row
    );
  }


export const updatePersonFilm = (
  users: () => QueryBuilder,
  cache: ICacheService
) => { 
  const getFilm = getPersonFilm(users, cache);

  return async (
    input: PersonFilm,
    person_id: number
  ) => {
    const {id, ...rest} = input;

    if( !! await getFilm(id, person_id) )
      return null;
  
    await users().where({id}).update(rest);

    return await cache.set(
      id,
      await users().select().where({id})
    );
  }
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
  limit: number | null,
  person_id: number
}

export const getPersonFilmList = (personfilms: () => QueryBuilder, cache: ICacheService) => 
  async (parameters: PersonFilmQueryParameters) => {
    let query = personfilms()
      .select()
      .where("person_id", "=", parameters.person_id);
    
    if(parameters.offset)
      query = query.offset(parameters.offset);
    
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
  personData: PersonData,
  cache: ICacheService
): Promise<Data> {
  const users = () => data.mysql.table('personfilm')

  return {
    get: getPersonFilm(users, cache),
    getList: getPersonFilmList(users, cache),
    create: createPersonFilm(users, personData, cache),
    update: updatePersonFilm(users, cache),
    delete: deletePersonFilm(users, cache)
  }
}
