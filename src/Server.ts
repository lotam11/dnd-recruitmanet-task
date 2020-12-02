import bodyParser from 'body-parser'
import chalk from 'chalk'
import express from 'express';
import {Express} from 'express'
import http from 'http'
import morgan from 'morgan'

import PersonHandler from './persons/PersonHandler'
import DataProvider, { DataClient } from './data/DataProvider'
import {promise} from './Middleware'
import {Server} from './Config'

const createHandlers = async (data: DataClient) => ({
  personHandler: (await PersonHandler.create(data))
});

export async function create () {
  const app = express()
  const data = await DataProvider.create()
  const handlers = await createHandlers(data)
  app
    .disable('x-powered-by')
    .use(morgan(Server.isDev ? 'dev' : 'combined'))
    .use(bodyParser.json())
    // .use(cookieSession({
    //   name: 'session',
    //   keys: ['pkdsM?o36UPYjuNx', 'QnwWwTnNiGd2M3>o', 'ikmUPhQcD78QTN;i'],

    //   // Cookie Options
    //   maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    // }))

    .post('/users/create', promise(async req => await handlers.personHandler.create(req) ));

  return app
}

export async function main () {
  let app = await create()

  const server = http.createServer(app)

  server.listen(Server.port, (err?: Error) => {
    if (err) {
      console.error(err)

      return
    }
    console.log(chalk.cyan(`> Started API on port ${chalk.yellow(Server.port.toString())}`))
  })

  // Support hot-swapping
  function replaceApp (newApp: Express) {
    server.removeListener('request', app)
    server.on('request', newApp)
    app = newApp
  }

  return replaceApp
}

export default {create, main}