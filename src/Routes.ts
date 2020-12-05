import {create as createHandlers, Handlers} from './Handlers'
import {Router} from 'express';
import { promise, asyncHandler } from './Middleware';

export async function createRouter(
  handlers: Handlers
): Promise<Router>{
  return Router()
    .post('/person', asyncHandler(handlers.personHandler.create))
    .get('/users/create', asyncHandler(handlers.personHandler.create));

}