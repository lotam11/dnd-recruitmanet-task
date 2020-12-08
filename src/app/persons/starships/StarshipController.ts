import {Request, Response} from 'express'
import Joi from 'joi'

import {DataClient} from '../../../data/DataProvider'
import { PersonStarship as Starship } from './StarshipData'
import {Service as StarshipService} from './StarshipService'


export const createStarship = (starships: StarshipService) => { 
  const validation = Joi.object().keys({ 
    name: Joi.number().required(),
    year_of_production: Joi.string().required(),
    description: Joi.string().required(),
    speed: Joi.number().required(), 
  });

  return async (req: Request, res: Response) => {
    const {person_id} = req.context;

    if( !person_id || isNaN(+person_id) ){
      res.status(404).end();
      return;
    }
    
    Joi.attempt(req.body, validation);

    const starship = await starships.create(req.body, person_id)
    
    res.json(starship).end();
  }
}

export const updateStarship = (starships: StarshipService) => { 
  const validation = Joi.object().keys({ 
    name: Joi.number().required(),
    year_of_production: Joi.string().required(),
    description: Joi.string().required(),
    speed: Joi.number().required(), 
    id: Joi.number().required(),
  });

  return async (req: Request, res: Response) => {
    const {person_id} = req.context;

    if( !person_id || isNaN(+person_id) ){
      res.status(404).end();
      return;
    }

    const input = {...req.body, id: req.params.id}

    Joi.attempt(input, validation);

    const starship = await starships.update(input, parseInt(person_id));
    
    res.json(starship).end();
  }
}

export function getStarship(starships: StarshipService){
  return async (req: Request, res: Response) => {
    const {person_id} = req.context;

    if( !person_id || isNaN(+person_id) ){
      res.status(404).end();
      return;
    }

    res.json(
      await starships.get(req.params.id, parseInt(person_id))
    ).end();
  }
}

export function getStarshipList(starships: StarshipService) {
  return async (req: Request, res: Response) => {
    const {person_id} = req.context;

    if( !person_id || isNaN(+person_id) ){
      res.status(404).end();
      return;
    }

    res.json(
      await starships.getList({
        offset: parseInt(req.query.query as string),
        limit: parseInt(req.query.limit as string),
        person_id: parseInt(person_id),
      })
    ).end();
  }
}

export function deleteStarship(starships: StarshipService) {
  return async (req: Request, res:Response) => {
    const {person_id} = req.context;

    if( !person_id || isNaN(+person_id) ){
      res.status(404).end();
      return;
    }

    const id = parseInt(req.params.id);

    await starships.delete(id);
    res.status(200).end()

  }
}

export async function create (starships: StarshipService) {

  return {
    get: getStarship(starships),
    create: createStarship(starships),
    getList: getStarshipList(starships),
    update: updateStarship(starships),
    delete: deleteStarship(starships)
  }
}

export default {create}