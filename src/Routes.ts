import {create as createHandlers, Handlers} from './Handlers'
import {Router} from 'express';
import asyncHandler from 'express-async-handler';

export async function createRouter(
  handlers: Handlers
): Promise<Router>{
  return Router()
    .post('/person', asyncHandler(handlers.personHandler.create))
    .get('/person/:id', asyncHandler(handlers.personHandler.get));

}