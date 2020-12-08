import {QueryBuilder} from 'knex';
import { ICacheService } from '../../../cache';
import {DataClient} from '../../../data/DataProvider';
import {Data as PersonData} from "../PersonData";

export interface PersonsVehicule {
  id: string
  name: string,
  description: string,
  year_of_production?: string,
  speed?: string,
  person_id?: number 
}

export const getPersonsVehicule = (vehicule: () => QueryBuilder, cache: ICacheService) => 
  async (id: string, person_id: number) => {
    const result = await cache
      .get(id)
      .resolve(async(): Promise<PersonsVehicule> =>
          (await vehicule().select().where({id}))[0] as PersonsVehicule
      )
    return (result.person_id == person_id)? result: null

  } 

export const createPersonsVehicule = (
  vehicule: () => QueryBuilder,
  perosns: PersonData,
  cache: ICacheService
) =>  
  async (
    person_id: string,
    input: PersonsVehicule
  ) => {
    
    if(! await perosns.get(person_id))
      return;

    const result = (await vehicule().insert({person_id, ...input}, ['id']))[0] as number;
    const [row] = await vehicule().select().where({id: result});

    return cache.set(
      result,
      row
    );
  }



export const updatePersonsVehicule = (vehicule: () => QueryBuilder, cache: ICacheService) => {
  const getVehicule = getPersonsVehicule(vehicule, cache);

  return async (input: PersonsVehicule, person_id: number) => {
    const {id, ...rest} = input;

    if( !! await getVehicule(id, person_id) )
      return null;

    await vehicule().where({id}).update(rest);

    return await cache.set(
      id,
      await vehicule().select().where({id})
    );
  }
}

export const deletePersonsVehicule = (vehicule: () => QueryBuilder, cache: ICacheService) => 
  async (id : number) => {
    await vehicule()
      .where({id})
      .delete()
      .then(() => cache.remove(id)); 
  }

interface PersonsVehiculeQueryParameters {
  offset: number | null,
  limit: number | null,
  person_id: string
}

export const getPersonsVehiculeList = (
  vehicules: () => QueryBuilder,
  cache: ICacheService
) => 
  async (parameters: PersonsVehiculeQueryParameters) => {
    let query = vehicules()
      .select()
      .where("person_id", "=", parameters.person_id);
    
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
  persons: PersonData,
  cache: ICacheService
): Promise<Data> {
  const vehicule = () => data.mysql.table('person_vehicles')

  return {
    get: getPersonsVehicule(vehicule, cache),
    getList: getPersonsVehiculeList(vehicule, cache),
    create: createPersonsVehicule(vehicule, persons, cache),
    update: updatePersonsVehicule(vehicule, cache),
    delete: deletePersonsVehicule(vehicule, cache)
  }
}
