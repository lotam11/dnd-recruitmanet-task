import bodyParser from 'body-parser'
import chalk from 'chalk'
import express from 'express';
import {Express} from 'express'
import http from 'http'
import morgan from 'morgan'
import jwt from 'express-jwt'

import PersonHandler from './persons/PersonHandler'
import DataProvider, { DataClient } from './data/DataProvider'
import {handleValidatorErrors, promise} from './Middleware'
import {Server} from './Config'
import * as Handlers from './Handlers'
import { createRouter } from './Routes';

function wrapAsync(fn: any) {
  return function(req: any, res: any, next: any) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next);
  };
}

export async function create () {
  const app = express();
  const data = await DataProvider.create();
  const handlers = await Handlers.create(data);
  const appRouter = await createRouter(handlers);
  
  app
    .disable('x-powered-by')
    .use(morgan(Server.isDev ? 'dev' : 'combined'))
    .use(bodyParser.json())
    .post("/authorize", wrapAsync(handlers.userHandler.authenticate))
    .use(
      appRouter.use(jwt({ secret: process.env.JWT_SECRET_KEY as string, algorithms: ['HS256']}))
    );
  app.use(handleValidatorErrors);
  return app;
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

export default {create, main};

main () 