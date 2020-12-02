import {QueryBuilder} from 'knex';
import {DataClient} from '../../data/DataProvider';

export interface PersonFilm {
  title: string,
  description: string,
  release_date?: string,
  PersonFilm_id: string
}

export const getPersonFilm = (users: () => QueryBuilder) => async (id: string) => {
  return (await users().select().where({id}) as PersonFilm[])[0]
} 

export const createPersonFilm = (users: () => QueryBuilder) => async (input?: PersonFilm) => {
  const result = (await users().insert(input, ['id']) as [{id: string}])[0]

  return (await users().select().where({id: result.id}) as PersonFilm[])[0]
}

export interface GetListInput extends Omit<PersonFilm, 'id'> {}

export const getPersonFilmList = (users: () => QueryBuilder) => async (input?: GetListInput) => {
  const query = users().select()
  if (input) query.where(input)

  return (await query as PersonFilm[])
}

 
export interface Data {
  get: ReturnType<typeof getPersonFilm>,
  getList: ReturnType<typeof getPersonFilmList>,
  create: ReturnType<typeof createPersonFilm>
}

export async function create (data: DataClient): Promise<Data> {
  const users = () => data.mysql.table('User')

  return {
    get: getPersonFilm(users),
    getList: getPersonFilmList(users),
    create: createPersonFilm(users),
  }
}
