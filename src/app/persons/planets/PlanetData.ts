import {QueryBuilder} from 'knex';
import { ICacheService } from '../../../cache';
import {DataClient} from '../../../data/DataProvider';
import {Data as PersonData} from "../PersonData";

export interface PersonPlanet {
  id: number,
  name: string,
  description: string,
  weight?: string,
  orbit_diameter?: string,
  radius?: string,
  area?: string,
  density?: string,
  person_id: number
}

export const getPersonPlanet = (users: () => QueryBuilder, cache: ICacheService) => 
  async (id: number, person_id: number) => {
    const result = await cache
      .get(id)
      .resolve(async(): Promise<PersonPlanet> =>
          (await users().select().where({id}))[0]
      )
    
      return (result.person_id == person_id)? result: null
  } 

export const createPersonPlanet = (
  users: () => QueryBuilder,
  cache: ICacheService,
  perosns: PersonData,
) => 
  async (input: PersonPlanet, person_id: string) => {
    if(!! perosns.get(person_id))
      return;

    const result = (await users().insert(input, ['id']))[0] as number;
    
    const [row] = await users().select().where({id: result});
    
    return cache.set(
      result,
      row
    );
  }


export const updatePersonPlanet = (users: () => QueryBuilder, cache: ICacheService) => {
  const getPlanet = getPersonPlanet(users, cache);

  return async (input: PersonPlanet, person_id: number) => {
    const {id, ...rest} = input;

    if( !! await getPlanet(id, person_id) )
      return null;

    await users().where({id}).update(rest);

    return await cache.set(
      id,
      await users().select().where({id})
    );
  }
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
  async (parameters: PersonPlanetQueryParameters, person_id: number) => {
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
  persons: PersonData,
  cache: ICacheService
): Promise<Data> {
  const users = () => data.mysql.table('personplanet')

  return {
    get: getPersonPlanet(users, cache),
    getList: getPersonPlanetList(users, cache),
    create: createPersonPlanet(users, cache, persons),
    update: updatePersonPlanet(users, cache),
    delete: deletePersonPlanet(users, cache)
  }
}
