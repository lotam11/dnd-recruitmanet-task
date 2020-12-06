import {create as createHandlers, Handlers} from './Handlers'
import {Router} from 'express';
import asyncHandler from 'express-async-handler';

export async function createRouter(
  handlers: Handlers
): Promise<Router>{
  return Router()
    .post('/persons', asyncHandler(handlers.personHandler.create))
    .get('/persons/:id', asyncHandler(handlers.personHandler.get))
    .get('/persons', asyncHandler(handlers.personHandler.getList));
}