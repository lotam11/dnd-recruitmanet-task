import {QueryBuilder} from 'knex';
import {DataClient} from '../data/DataProvider';

export interface Person {
  id: number,
  nickname: string,
  fullname?: string,
  description?: string
}

export const getPerson = (users: () => QueryBuilder) => async (id: string) => {
  return (await users().select().where({id}) as Person[])[0]
} 

export const createPerson = (users: () => QueryBuilder) => async (input?: Person) => {
  const result = (await users().insert(input, ['id']) as [{id: string}])[0]
  const row = await users().select().where({id: result});
  return (row as Person[])[0]
}


export const updatePerson = (users: () => QueryBuilder) => async (input: Person) => {
  const {id, ...rest} = input;
  await users()
    .where({id})
    .update(rest);

  return await users().select().where({id});
}

interface PersonQueryParameters {
  offset: number | null,
  limit: number | null
}

export const getPersonList = (persons: () => QueryBuilder) => 
  async (parameters: PersonQueryParameters) => {
    let query = persons().select();
    
    if(parameters.offset)
      query = query.where("id", ">", parameters.offset);
    
    if(parameters.limit)
      query = query.limit(parameters.limit);

    return (await query as Person[])
  }

 
export interface Data {
  get: ReturnType<typeof getPerson>,
  getList: ReturnType<typeof getPersonList>,
  create: ReturnType<typeof createPerson>,
  update: ReturnType<typeof updatePerson>
}

export async function create (data: DataClient): Promise<Data> {
  const users = () => data.mysql.table('person')

  return {
    get: getPerson(users),
    getList: getPersonList(users),
    create: createPerson(users),
    update: updatePerson(users)
  }
}
