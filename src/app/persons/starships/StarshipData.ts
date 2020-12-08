import {QueryBuilder} from 'knex';
import { ICacheService } from '../../../cache';
import {DataClient} from '../../../data/DataProvider';
import {Data as PersonData} from "../PersonData";

export interface PersonStarship {
  id: string
  name: string,
  description: string,
  year_of_production?: string,
  speed?: string,
  person_id: number
}

export const getPersonStarship = (
  starships: () => QueryBuilder,
  cache: ICacheService
) => 
  async (id: string, person_id: number ) => {
    const result = await cache
      .get(id)
      .resolve(async(): Promise<PersonStarship> =>
          (await starships().select().where({id}))[0]
      );
    return (result.person_id == person_id)? result: null
  } 

export const createPersonStarship = (
  starships: () => QueryBuilder,
  cache: ICacheService,
  perosns: PersonData,
) => 
  async (input: PersonStarship, person_id: string) => {
    if(!! perosns.get(person_id))
      return;

    const result = (await starships().insert(input, ['id']))[0] as number;
    const [row] = await starships().select().where({id: result});
    
    return cache.set(
      result,
      row
    );
  }


export const updatePersonStarship = (
  starships: () => QueryBuilder,
  cache: ICacheService,
) => {
  const getStarship = getPersonStarship(starships, cache);

  return async (
    input: PersonStarship,
    person_id: number
  ) => {
    const {id, ...rest} = input;
    
    if( !! await getStarship(id, person_id) )
      return null;

    await starships().where({id}).update(rest);

    return await cache.set(
      id,
      await starships().select().where({id})
    );
  }
}
export const deletePersonStarship = (
  starships: () => QueryBuilder,
  cache: ICacheService
) => 
  async (id : number) => {
    await starships()
      .where({id})
      .delete()
      .then(() => cache.remove(id)); 
  }

interface PersonStarshipQueryParameters {
  offset: number,
  limit: number,
  person_id: number
}

export const getPersonStarshipList = (
  starships: () => QueryBuilder,
  cache: ICacheService
) => 
  async (parameters: PersonStarshipQueryParameters) => {
    let query = starships()
      .select()
      .where("person_id", "=", parameters.person_id);
    
    if(parameters.offset)
      query = query.offset(parameters.offset);
    
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
  personData: PersonData,
  cache: ICacheService
): Promise<Data> {
  const starships = () => data.mysql.table('person_starship');
  const persons = () => data.mysql.table('persons')


  return {
    get: getPersonStarship(starships, cache),
    getList: getPersonStarshipList(starships, cache),
    create: createPersonStarship(starships, cache, personData),
    update: updatePersonStarship(starships, cache),
    delete: deletePersonStarship(starships, cache)
  }
}
