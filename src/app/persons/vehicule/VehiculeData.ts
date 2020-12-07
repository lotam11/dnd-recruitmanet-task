import {QueryBuilder} from 'knex';
import { ICacheService } from '../../../cache';
import {DataClient} from '../../../data/DataProvider';

export interface PersonsVehicule {
  id: string
  title: string,
  description: string,
  release_date?: string,
  PersonsVehiculeVehicule_id: string
}

export const getPersonsVehicule = (users: () => QueryBuilder, cache: ICacheService) => 
  async (id: string) => {
    return cache
      .get(id)
      .resolve(async() =>
          (await users().select().where({id}))[0] as PersonsVehicule
      )
  } 

export const createPersonsVehicule = (users: () => QueryBuilder, cache: ICacheService) => 
  async (input?: PersonsVehicule) => {
    const result = (await users().insert(input, ['id']))[0] as number;
    const [row] = await users().select().where({id: result});
    return cache.set(
      result,
      row
    );
  }


export const updatePersonsVehicule = (users: () => QueryBuilder, cache: ICacheService) => 
  async (input: PersonsVehicule) => {
    const {id, ...rest} = input;
    await users().where({id}).update(rest);

    return await cache.set(
      id,
      await users().select().where({id})
    );
  }

export const deletePersonsVehicule = (users: () => QueryBuilder, cache: ICacheService) => 
  async (id : number) => {
    await users()
      .where({id})
      .delete()
      .then(() => cache.remove(id)); 
  }

interface PersonsVehiculeQueryParameters {
  offset: number | null,
  limit: number | null
}

export const getPersonsVehiculeList = (personsvehicules: () => QueryBuilder, cache: ICacheService) => 
  async (parameters: PersonsVehiculeQueryParameters) => {
    let query = personsvehicules().select();
    
    if(parameters.offset)
      query = query.where("id", ">", parameters.offset);
    
    if(parameters.limit)
      query = query.limit(parameters.limit);

    const result = await query as PersonsVehicule[]
    
    cache.storeBulk(result, (obj) => obj.id);

    return result;
  }

 
export interface Data {
  get: ReturnType<typeof getPersonsVehicule>,
  getList: ReturnType<typeof getPersonsVehiculeList>,
  create: ReturnType<typeof createPersonsVehicule>,
  update: ReturnType<typeof updatePersonsVehicule>
  delete: ReturnType<typeof deletePersonsVehicule>
}

export async function create (
  data: DataClient,
  cache: ICacheService
): Promise<Data> {
  const users = () => data.mysql.table('personsvehicule')

  return {
    get: getPersonsVehicule(users, cache),
    getList: getPersonsVehiculeList(users, cache),
    create: createPersonsVehicule(users, cache),
    update: updatePersonsVehicule(users, cache),
    delete: deletePersonsVehicule(users, cache)
  }
}
