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
    Joi.attempt(req.body, validation);

    const planet = await planets.create(req.body)
    
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
    const input = {...req.body, id: req.params.id}

    Joi.attempt(input, validation);

    const planet = await planets.update(input)
    
    res.json(planet).end();
  }
}

export function getPlanet(planets: PlanetService){
  return async (req: Request, res: Response) =>
    res.json(
      await planets.get(req.params.id)
    ).end();
}

export function getPlanetList(planets: PlanetService) {
  return async (req: Request, res: Response) =>
    res.json(
      await planets.getList({
        offset: parseInt(req.query.query as string),
        limit: parseInt(req.query.limit as string)
      })
    ).end();
}

export function deletePlanet(planets: PlanetService) {
  return async (req: Request, res:Response) => {
    if(isNaN(+req.params.id)){
      res.status(400).json({error: "id must be a number"}).end();
      return
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