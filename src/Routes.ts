import {create as createHandlers, Handlers} from './Handlers'
import {Router} from 'express';
import asyncHandler from 'express-async-handler';
import { number } from 'joi';

interface CustomRequestContext {
  person_id?: string
};

declare global{
  namespace Express {
      interface Request {
          context: CustomRequestContext
      }
  }
}


export async function createRouter(
  handlers: Handlers
): Promise<Router>{
  return Router()

    .use("/persons/", Router()
      .post('/', asyncHandler(handlers.personHandler.create))
      .get('/:id', asyncHandler(handlers.personHandler.get))
      .put('/:id', asyncHandler(handlers.personHandler.update))
      .delete('/:id', asyncHandler(handlers.personHandler.delete))
      .get('/', asyncHandler(handlers.personHandler.getList))
    )

    .use("/persons/:person_id", (req, res, next) => {
        req.context = {person_id: req.params.person_id};
        next()
      }, Router()
      .use("/planets", Router()  
        .post('/', asyncHandler(handlers.planetHandler.create))
        .get('/:id', asyncHandler(handlers.planetHandler.get))
        .put('/:id', asyncHandler(handlers.planetHandler.update))
        .delete('/:id', asyncHandler(handlers.planetHandler.delete))
        .get('/', asyncHandler(handlers.planetHandler.getList))
      )

      .use("/vehicules", Router()  
        .post('/', asyncHandler(handlers.vehiculeHandler.create))
        .get('/:id', asyncHandler(handlers.vehiculeHandler.get))
        .put('/:id', asyncHandler(handlers.vehiculeHandler.update))
        .delete('/:id', asyncHandler(handlers.vehiculeHandler.delete))
        .get('/', asyncHandler(handlers.vehiculeHandler.getList))
      )
      
      .use("/starships", Router()  
        .post('/', asyncHandler(handlers.starshipHandler.create))
        .get('/:id', asyncHandler(handlers.starshipHandler.get))
        .put('/:id', asyncHandler(handlers.starshipHandler.update))
        .delete('/:id', asyncHandler(handlers.starshipHandler.delete))
        .get('/', asyncHandler(handlers.starshipHandler.getList))
      )
    )
}