/* tslint:disable await-promise */
import Knex from 'knex'

import {Database} from '../Config'

/**
 * Initialize a new Postgres provider
 */
export async function create () {
  const knex = Knex({
    client: 'mysql',
    connection: {
      user: Database.user,
      password: Database.password,
      host: Database.host,
      port: Database.port,
      database: Database.database
    },
  })

  // Verify the connection before proceeding
  try {
    await knex.raw('SELECT now()')

    return knex
  } catch (error) {
    throw new Error('Unable to connect to Postgres via Knex. Ensure a valid connection.')
  }
}

export default {create}