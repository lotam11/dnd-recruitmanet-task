import {QueryBuilder} from 'knex';
import { ICacheService } from '../../../cache';
import {DataClient} from '../../../data/DataProvider';

export interface PersonStarship {
  id: number,
  title: string,
  description: string,
  release_date?: string,
  PersonStarshipStarship_id: string
}

export const getPersonStarship = (users: () => QueryBuilder, cache: ICacheService) => 
  async (id: string) => {
    return cache
      .get(id)
      .resolve(async() =>
          (await users().select().where({id}))[0] as PersonStarship
      )
  } 

export const createPersonStarship = (users: () => QueryBuilder, cache: ICacheService) => 
  async (input?: PersonStarship) => {
    const result = (await users().insert(input, ['id']))[0] as number;
    const [row] = await users().select().where({id: result});
    return cache.set(
      result,
      row
    );
  }


export const updatePersonStarship = (users: () => QueryBuilder, cache: ICacheService) => 
  async (input: PersonStarship) => {
    const {id, ...rest} = input;
    await users().where({id}).update(rest);

    return await cache.set(
      id,
      await users().select().where({id})
    );
  }

export const deletePersonStarship = (users: () => QueryBuilder, cache: ICacheService) => 
  async (id : number) => {
    await users()
      .where({id})
      .delete()
      .then(() => cache.remove(id)); 
  }

interface PersonStarshipQueryParameters {
  offset: number | null,
  limit: number | null
}

export const getPersonStarshipList = (personstarships: () => QueryBuilder, cache: ICacheService) => 
  async (parameters: PersonStarshipQueryParameters) => {
    let query = personstarships().select();
    
    if(parameters.offset)
      query = query.where("id", ">", parameters.offset);
    
    if(parameters.limit)
      query = query.limit(parameters.limit);

    const result = await query as PersonStarship[]
    
    cache.storeBulk(result, (obj) => obj.id);

    return result;
  }

 
export interface Data {
  get: ReturnType<typeof getPersonStarship>,
  getList: ReturnType<typeof getPersonStarshipList>,
  create: ReturnType<typeof createPersonStarship>,
  update: ReturnType<typeof updatePersonStarship>
  delete: ReturnType<typeof deletePersonStarship>
}

export async function create (
  data: DataClient,
  cache: ICacheService
): Promise<Data> {
  const users = () => data.mysql.table('personstarship')

  return {
    get: getPersonStarship(users, cache),
    getList: getPersonStarshipList(users, cache),
    create: createPersonStarship(users, cache),
    update: updatePersonStarship(users, cache),
    delete: deletePersonStarship(users, cache)
  }
}
