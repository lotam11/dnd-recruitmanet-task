import {QueryBuilder} from 'knex';
import {DataClient} from '../../../data/DataProvider';

export interface PersonStarship {
  title: string,
  description: string,
  release_date?: string,
  PersonStarship_id: string
}

export const getPersonStarship = (users: () => QueryBuilder) => async (id: string) => {
  return (await users().select().where({id}) as PersonStarship[])[0]
} 

export const createPersonStarship = (users: () => QueryBuilder) => async (input?: PersonStarship) => {
  const result = (await users().insert(input, ['id']) as [{id: string}])[0]

  return (await users().select().where({id: result.id}) as PersonStarship[])[0]
}

export interface GetListInput extends Omit<PersonStarship, 'id'> {}

export const getPersonStarshipList = (users: () => QueryBuilder) => async (input?: GetListInput) => {
  const query = users().select()
  if (input) query.where(input)

  return (await query as PersonStarship[])
}

 
export interface Data {
  get: ReturnType<typeof getPersonStarship>,
  getList: ReturnType<typeof getPersonStarshipList>,
  create: ReturnType<typeof createPersonStarship>
}

export async function create (data: DataClient): Promise<Data> {
  const users = () => data.mysql.table('User')

  return {
    get: getPersonStarship(users),
    getList: getPersonStarshipList(users),
    create: createPersonStarship(users),
  }
}
