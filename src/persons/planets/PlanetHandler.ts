import {Request} from 'express'

import {DataClient} from '../../data/DataProvider'
import PlanetController, {Controller} from './PlanetController'

export const getCurrentPlanet = (planets: Controller) => async (req: Request) => {
  return planets.get(req.body.id)
}

export const createPlanet = (planets: Controller) => async (req: Request) => {
  const planet = await planets.create()
  return planet
}

export async function create (data: DataClient) {
  const planets = await PlanetController.create(data)

  return {
    getCurrent: getCurrentPlanet(planets),
    create: createPlanet(planets),
  }
}

export default {create}