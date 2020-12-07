import {Data} from './PlanetData';
import * as PlanetData from './PlanetData';

export interface Service {
  get: ReturnType<typeof getPlanet>,
  getList: ReturnType<typeof getPlanetList>,
  create: ReturnType<typeof createPlanet>,
  update: ReturnType<typeof updatePlanet>,
  delete: ReturnType<typeof deletePlanet>
}

export const getPlanet = (planets: Data) => planets.get;

export const getPlanetList = (planets: Data) => planets.getList;

export const createPlanet = (planets: Data) => planets.create;

export const updatePlanet = (planets: Data) => planets.update;

export const deletePlanet = (planets: Data) => planets.delete;


export async function create (
  planets: PlanetData.Data,
): Promise<Service> {
  return {
    get: getPlanet(planets),
    getList: getPlanetList(planets),
    create: createPlanet(planets),
    update: updatePlanet(planets),
    delete: deletePlanet(planets)
  }
}

export default {create}