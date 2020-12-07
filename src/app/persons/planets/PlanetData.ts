import {QueryBuilder} from 'knex';
import { ICacheService } from '../../../cache';
import {DataClient} from '../../../data/DataProvider';

export interface PersonPlanet {
  id: number,
  title: string,
  description: string,
  release_date?: string,
  PersonPlanetPlanet_id: string
}
export const getPersonPlanet = (users: () => QueryBuilder, cache: ICacheService) => 
  async (id: string) => {
    return cache
      .get(id)
      .resolve(async() =>
          (await users().select().where({id}))[0] as PersonPlanet
      )
  } 

export const createPersonPlanet = (users: () => QueryBuilder, cache: ICacheService) => 
  async (input?: PersonPlanet) => {
    const result = (await users().insert(input, ['id']))[0] as number;
    const [row] = await users().select().where({id: result});
    return cache.set(
      result,
      row
    );
  }


export const updatePersonPlanet = (users: () => QueryBuilder, cache: ICacheService) => 
  async (input: PersonPlanet) => {
    const {id, ...rest} = input;
    await users().where({id}).update(rest);

    return await cache.set(
      id,
      await users().select().where({id})
    );
  }

export const deletePersonPlanet = (users: () => QueryBuilder, cache: ICacheService) => 
  async (id : number) => {
    await users()
      .where({id})
      .delete()
      .then(() => cache.remove(id)); 
  }

interface PersonPlanetQueryParameters {
  offset: number | null,
  limit: number | null
}

export const getPersonPlanetList = (personplanets: () => QueryBuilder, cache: ICacheService) => 
  async (parameters: PersonPlanetQueryParameters) => {
    let query = personplanets().select();
    
    if(parameters.offset)
      query = query.where("id", ">", parameters.offset);
    
    if(parameters.limit)
      query = query.limit(parameters.limit);

    const result = await query as PersonPlanet[]
    
    cache.storeBulk(result, (obj) => obj.id);

    return result;
  }

 
export interface Data {
  get: ReturnType<typeof getPersonPlanet>,
  getList: ReturnType<typeof getPersonPlanetList>,
  create: ReturnType<typeof createPersonPlanet>,
  update: ReturnType<typeof updatePersonPlanet>
  delete: ReturnType<typeof deletePersonPlanet>
}

export async function create (
  data: DataClient,
  cache: ICacheService
): Promise<Data> {
  const users = () => data.mysql.table('personplanet')

  return {
    get: getPersonPlanet(users, cache),
    getList: getPersonPlanetList(users, cache),
    create: createPersonPlanet(users, cache),
    update: updatePersonPlanet(users, cache),
    delete: deletePersonPlanet(users, cache)
  }
}
