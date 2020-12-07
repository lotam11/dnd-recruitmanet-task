import bodyParser from 'body-parser'
import chalk from 'chalk'
import express from 'express';
import {Express} from 'express'
import http from 'http'
import morgan from 'morgan'
import jwt from 'express-jwt'

import PersonHandler from './app/persons/PersonController'
import DataProvider, { DataClient } from './data/DataProvider'
import {handleValidatorErrors, promise, wrapAsync} from './Middleware'
import {Server} from './Config'
import * as Handlers from './Handlers'
import { createRouter } from './Routes';
import * as JwtAuth from './auth/JWTAuthService';
import asyncHandler from 'express-async-handler';

export async function create () {
  const app = express();
  const data = await DataProvider.create();
  const authService = await JwtAuth.create({
    secretkey: Server.jwtSecret as string,
    expiresIn: 400
  })
  const handlers = await Handlers.create(data, authService);
  const appRouter = await createRouter(handlers);
  
  app
    .disable('x-powered-by')
    .use(morgan(Server.isDev ? 'dev' : 'combined'))
    .use(bodyParser.json())
    .post("/authorize", asyncHandler(handlers.userHandler.authenticate))
    .post("/register", asyncHandler(handlers.userHandler.register))
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