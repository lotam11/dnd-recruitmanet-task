import Knex from 'knex'

import * as MysqlProvider from './MysqlProvider'

export interface DataClient {
  mysql: Knex,
}

export async function create (): Promise<DataClient> {
  return {
    mysql: await MysqlProvider.create(),
  }
}

export default {create}