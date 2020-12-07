import {QueryBuilder} from 'knex';
import { ICacheService } from '../../../cache';
import {DataClient} from '../../../data/DataProvider';

export interface PersonStarship {
  id: string
  name: string,
  description: string,
  year_of_production?: string,
  speed?: string
}

export const getPersonStarship = (starships: () => QueryBuilder, cache: ICacheService) => 
  async (id: string) => {
    return cache
      .get(id)
      .resolve(async() =>
          (await starships().select().where({id}))[0] as PersonStarship
      )
  } 

export const createPersonStarship = (starships: () => QueryBuilder, cache: ICacheService) => 
  async (input?: PersonStarship) => {
    const result = (await starships().insert(input, ['id']))[0] as number;
    const [row] = await starships().select().where({id: result});
    return cache.set(
      result,
      row
    );
  }


export const updatePersonStarship = (starships: () => QueryBuilder, cache: ICacheService) => 
  async (input: PersonStarship) => {
    const {id, ...rest} = input;
    await starships().where({id}).update(rest);

    return await cache.set(
      id,
      await starships().select().where({id})
    );
  }

export const deletePersonStarship = (starships: () => QueryBuilder, cache: ICacheService) => 
  async (id : number) => {
    await starships()
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
  const starships = () => data.mysql.table('personstarship')

  return {
    get: getPersonStarship(starships, cache),
    getList: getPersonStarshipList(starships, cache),
    create: createPersonStarship(starships, cache),
    update: updatePersonStarship(starships, cache),
    delete: deletePersonStarship(starships, cache)
  }
}
