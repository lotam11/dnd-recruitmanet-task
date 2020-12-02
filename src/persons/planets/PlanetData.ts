import {QueryBuilder} from 'knex';
import {DataClient} from '../../data/DataProvider';

export interface PersonPlanet {
  title: string,
  description: string,
  release_date?: string,
  PersonPlanet_id: string
}

export const getPersonPlanet = (users: () => QueryBuilder) => async (id: string) => {
  return (await users().select().where({id}) as PersonPlanet[])[0]
} 

export const createPersonPlanet = (users: () => QueryBuilder) => async (input?: PersonPlanet) => {
  const result = (await users().insert(input, ['id']) as [{id: string}])[0]

  return (await users().select().where({id: result.id}) as PersonPlanet[])[0]
}

export interface GetListInput extends Omit<PersonPlanet, 'id'> {}

export const getPersonPlanetList = (users: () => QueryBuilder) => async (input?: GetListInput) => {
  const query = users().select()
  if (input) query.where(input)

  return (await query as PersonPlanet[])
}

 
export interface Data {
  get: ReturnType<typeof getPersonPlanet>,
  getList: ReturnType<typeof getPersonPlanetList>,
  create: ReturnType<typeof createPersonPlanet>
}

export async function create (data: DataClient): Promise<Data> {
  const users = () => data.mysql.table('User')

  return {
    get: getPersonPlanet(users),
    getList: getPersonPlanetList(users),
    create: createPersonPlanet(users),
  }
}
