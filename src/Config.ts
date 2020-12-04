import dotenv from 'dotenv'

dotenv.config()

export namespace Database {
  export const host = process.env.MYSQL_HOST;
  export const port = parseInt(process.env.MYSQL_PORT as string);
  export const database = process.env.MYSQL_DB;
  export const user = process.env.MYSQL_USER;
  export const password = process.env.MYSQL_PASSWORD
}


export namespace Server {
  export const port = Number(process.env.PORT || '8000')
  export const bodyLimit = '100kb'
  export const corsHeaders = ['Link']
  export const isDev = process.env.NODE_ENV === 'development'
  export const jwtSecret = process.env.JWT_SECRET_KEY
}

export namespace Knex {
  export const config = {
    client: 'mysql',
    connection: {
      host: process.env.DATABASE_HOSTNAME || Database.host,
      database: process.env.DATABASE_NAME || Database.database,
      user: process.env.DATABASE_USERNAME || Database.user,
      password: process.env.DATABASE_PASSWORD || Database.password,
      port: process.env.DATABASE_PORT || Database.port,
    },
    pool: {
      min: process.env.DATABASE_POOL_MIN,
      max: process.env.DATABASE_POOL_MAX,
      idle: process.env.DATABASE_POOL_IDLE,
    },
    migrations: {
      tableName: 'KnexMigrations',
    },
  }
}