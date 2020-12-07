import {Data, GetListInput, PersonPlanet} from './PlanetData';
import * as PlanetData from './PlanetData';

import {DataClient} from '../../../data/DataProvider'

export interface Controller {
  get: ReturnType<typeof getPlanet>,
  getList: ReturnType<typeof getPlanetList>,
  create: ReturnType<typeof createPlanet>,
}

export const getPlanet = (planets: Data) => async (input: string) => {
  return planets.get(input)
}

export const getPlanetList = (planets: Data) => async (input?: GetListInput) => {
  return planets.getList(input)
}

export const createPlanet = (planets: Data) => async (input?: PersonPlanet) => {
  return planets.create(input)
}

export async function create (data: DataClient): Promise<Controller> {
  const Planets = await PlanetData.create(data)

  return {
    get: getPlanet(Planets),
    getList: getPlanetList(Planets),
    create: createPlanet(Planets),
  }
}

export default {create}
