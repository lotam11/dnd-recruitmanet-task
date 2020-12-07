import {QueryBuilder} from 'knex';
import { ICacheService } from '../../cache';
import {DataClient} from '../../data/DataProvider';

export interface Person {
  id: number,
  nickname: string,
  fullname?: string,
  description?: string
}

export const getPerson = (users: () => QueryBuilder, cache: ICacheService) => 
  async (id: string) => {
    return cache
      .get(id)
      .resolve(async() =>
          (await users().select().where({id}))[0] as Person
      )
  } 

export const createPerson = (users: () => QueryBuilder, cache: ICacheService) => 
  async (input?: Person) => {
    const result = (await users().insert(input, ['id'])) as number;
    const [row] = await users().select().where({id: result});
    return cache.set(
      result,
      row
    );
  }


export const updatePerson = (users: () => QueryBuilder, cache: ICacheService) => 
  async (input: Person) => {
    const {id, ...rest} = input;
    await users().where({id}).update(rest);

    return await cache.set(
      id,
      await users().select().where({id})
    );
  }

export const deletePerson = (users: () => QueryBuilder, cache: ICacheService) => 
  async (id : number) => {
    await users()
      .where({id})
      .delete()
      .then(() => cache.remove(id)); 
  }

interface PersonQueryParameters {
  offset: number | null,
  limit: number | null
}

export const getPersonList = (persons: () => QueryBuilder, cache: ICacheService) => 
  async (parameters: PersonQueryParameters) => {
    let query = persons().select();
    
    if(parameters.offset)
      query = query.where("id", ">", parameters.offset);
    
    if(parameters.limit)
      query = query.limit(parameters.limit);

    const result = await query as Person[]
    
    cache.storeBulk(result, (obj) => obj.id);

    return result;
  }

 
export interface Data {
  get: ReturnType<typeof getPerson>,
  getList: ReturnType<typeof getPersonList>,
  create: ReturnType<typeof createPerson>,
  update: ReturnType<typeof updatePerson>
  delete: ReturnType<typeof deletePerson>
}

export async function create (
  data: DataClient,
  cache: ICacheService
): Promise<Data> {
  const users = () => data.mysql.table('person')

  return {
    get: getPerson(users, cache),
    getList: getPersonList(users, cache),
    create: createPerson(users, cache),
    update: updatePerson(users, cache),
    delete: deletePerson(users, cache)
  }
}
