import {create as createHandlers, Handlers} from './Handlers'
import {Router} from 'express';
import { promise, wrapAsync } from './Middleware';

export async function createRouter(
  handlers: Handlers
): Promise<Router>{
  return Router()
    .post('/person', wrapAsync(handlers.personHandler.create))
    .get('/users/create', wrapAsync(handlers.personHandler.create));

}