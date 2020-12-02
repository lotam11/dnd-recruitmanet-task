import {QueryBuilder} from 'knex';
import {DataClient} from '../data/DataProvider';

export interface Person {
  nickname: string,
  fullname?: string,
  description?: string
}

export const getPerson = (users: () => QueryBuilder) => async (id: string) => {
  return (await users().select().where({id}) as Person[])[0]
} 

export const createPerson = (users: () => QueryBuilder) => async (input?: Person) => {
  const result = (await users().insert(input, ['id']) as [{id: string}])[0]

  return (await users().select().where({id: result.id}) as Person[])[0]
}

export interface GetListInput extends Omit<Person, 'id'> {}

export const getPersonList = (users: () => QueryBuilder) => async (input?: GetListInput) => {
  const query = users().select()
  if (input) query.where(input)

  return (await query as Person[])
}

 
export interface Data {
  get: ReturnType<typeof getPerson>,
  getList: ReturnType<typeof getPersonList>,
  create: ReturnType<typeof createPerson>
}

export async function create (data: DataClient): Promise<Data> {
  const users = () => data.mysql.table('User')

  return {
    get: getPerson(users),
    getList: getPersonList(users),
    create: createPerson(users),
  }
}
