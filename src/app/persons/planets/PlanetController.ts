import {Request, Response} from 'express'
import Joi from 'joi'

import {DataClient} from '../../../data/DataProvider'
import { PersonPlanet as Planet } from './PlanetData'
import {Service as PlanetService} from './PlanetService'


export const createPlanet = (planets: PlanetService) => { 
  const validation = Joi.object().keys({ 
    name: Joi.string().required(),
    description: Joi.string().required(),
    weight: Joi.string().required(),
    orbit_diameter: Joi.string().required(),
    radius: Joi.string().required(),
    area: Joi.string().required(),
    density: Joi.string().required(),
    release_date: Joi.number(), 
  });

  return async (req: Request, res: Response) => {
    const {person_id} = req.context;

    if( !person_id || isNaN(+person_id) ){
      res.status(404).end();
      return;
    }

    Joi.attempt(req.body, validation);

    const planet = await planets.create(req.body, person_id)
    
    res.json(planet).end();
  }
}

export const updatePlanet = (planets: PlanetService) => { 
  const validation = Joi.object().keys({ 
    name: Joi.string().required(),
    description: Joi.string().required(),
    weight: Joi.string().required(),
    orbit_diameter: Joi.string().required(),
    radius: Joi.string().required(),
    area: Joi.string().required(),
    density: Joi.string().required(),
    release_date: Joi.number(), 
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

    const planet = await planets.update(input, parseInt(person_id))
    
    res.json(planet).end();
  }
}

export function getPlanet(planets: PlanetService){
  return async (req: Request, res: Response) => {
    const {person_id} = req.context;

    if( !person_id || isNaN(+person_id) ){
      res.status(404).end();
      return;
    }
 
    res.json(
      await planets.get(parseInt(req.params.id), parseInt(person_id))
    ).end();
  }
}

export function getPlanetList(planets: PlanetService) {
  return async (req: Request, res: Response) => {
    const {person_id} = req.context;

    if( !person_id || isNaN(+person_id) ){
      res.status(404).end();
      return;
    }

    res.json(
      await planets.getList({
        offset: parseInt(req.query.query as string),
        limit: parseInt(req.query.limit as string)
      },parseInt(person_id))
    ).end();
  }
}

export function deletePlanet(planets: PlanetService) {
  return async (req: Request, res:Response) => {
    const {person_id} = req.context;

    if( !person_id || isNaN(+person_id) ){
      res.status(404).end();
      return;
    }

    const id = parseInt(req.params.id);

    await planets.delete(id);
    res.status(200).end()

  }
}

export async function create (planets: PlanetService) {

  return {
    get: getPlanet(planets),
    create: createPlanet(planets),
    getList: getPlanetList(planets),
    update: updatePlanet(planets),
    delete: deletePlanet(planets)
  }
}

export default {create}