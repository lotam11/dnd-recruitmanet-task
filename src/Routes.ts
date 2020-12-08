import {create as createHandlers, Handlers} from './Handlers'
import {Router} from 'express';
import asyncHandler from 'express-async-handler';

export function starshipRouter(handlers: Handlers){
  return Router()
    .post('/', asyncHandler(handlers.personHandler.create))
    .get(':id', asyncHandler(handlers.personHandler.get))
    .put(':id', asyncHandler(handlers.personHandler.update))
    .delete(':id', asyncHandler(handlers.personHandler.delete))
    .get('/', asyncHandler(handlers.personHandler.getList));;
}

export function personsRouter(handlers: Handlers){
  return Router()
    .post('/', asyncHandler(handlers.personHandler.create))
    .get(':id', asyncHandler(handlers.personHandler.get))
    .put(':id', asyncHandler(handlers.personHandler.update))
    .delete(':id', asyncHandler(handlers.personHandler.delete))
    .get('/', asyncHandler(handlers.personHandler.getList));;
}

export async function createRouter(
  handlers: Handlers
): Promise<Router>{
  return Router()
    .use("/persons", personsRouter(handlers))
    
}