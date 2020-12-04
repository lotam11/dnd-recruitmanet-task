import {QueryBuilder} from 'knex';
import {DataClient} from '../data/DataProvider';

export interface User {
  id: number,
  identificator: string,
  hash: string,
}

export interface UserInput {
  identifier: string,
  hash: string
}

export const getHash = (users: () => QueryBuilder) => 
  async (identifier: string) => {
    return (await users().select().where({identifier})).hash as string
  }

export const createUser = (users: () => QueryBuilder) => async (input?: UserInput) => {
  await users().insert(input);
}

export interface Data {
  getHash: ReturnType<typeof getHash>,
  create: ReturnType<typeof createUser>
}

export async function create (data: DataClient): Promise<Data> {
  const users = () => data.mysql.table('User')

  return {
    getHash: getHash(users),
    create: createUser(users),
  }
}
