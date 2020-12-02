import {QueryBuilder} from 'knex';
import {DataClient} from '../../data/DataProvider';

export interface PersonVehicule {
  title: string,
  description: string,
  release_date?: string,
  PersonVehicule_id: string
}

export const getPersonVehicule = (users: () => QueryBuilder) => async (id: string) => {
  return (await users().select().where({id}) as PersonVehicule[])[0]
} 

export const createPersonVehicule = (users: () => QueryBuilder) => async (input?: PersonVehicule) => {
  const result = (await users().insert(input, ['id']) as [{id: string}])[0]

  return (await users().select().where({id: result.id}) as PersonVehicule[])[0]
}

export interface GetListInput extends Omit<PersonVehicule, 'id'> {}

export const getPersonVehiculeList = (users: () => QueryBuilder) => async (input?: GetListInput) => {
  const query = users().select()
  if (input) query.where(input)

  return (await query as PersonVehicule[])
}

 
export interface Data {
  get: ReturnType<typeof getPersonVehicule>,
  getList: ReturnType<typeof getPersonVehiculeList>,
  create: ReturnType<typeof createPersonVehicule>
}

export async function create (data: DataClient): Promise<Data> {
  const users = () => data.mysql.table('User')

  return {
    get: getPersonVehicule(users),
    getList: getPersonVehiculeList(users),
    create: createPersonVehicule(users),
  }
}
