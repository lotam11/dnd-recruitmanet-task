import {create as createHandlers, Handlers} from './Handlers'
import {Router} from 'express';
import { promise } from './Middleware';

export async function createRouter(
  handlers: Handlers
): Promise<Router>{
  return Router()
    .post('/person', promise(async req => await handlers.personHandler.create(req) ))
    .get('/users/create', promise(async req => await handlers.personHandler.getCurrent(req) ));

}