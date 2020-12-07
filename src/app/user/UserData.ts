import {QueryBuilder} from 'knex';
import {DataClient} from '../../data/DataProvider';

export interface User {
  id: number,
  identificator: string,
  hash: string,
}

export interface UserInput {
  identifier: string,
  hash: string
}

export interface Data {
  getHash: ReturnType<typeof getHash>,
  create: ReturnType<typeof createUser>
}

export const getHash = (users: () => QueryBuilder) => 
  async (identifier: string) => {
    const [result] = await users().select().where({identifier}).limit(1);
    return result.hash as string
  }

export const createUser = (users: () => QueryBuilder) => async (input?: UserInput) => {
  await users().insert(input);
}

export async function create (data: DataClient): Promise<Data> {
  const users = () => data.mysql.table('users')

  return {
    getHash: getHash(users),
    create: createUser(users),
  }
}
