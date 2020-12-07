import {Data} from './StarshipData';
import * as StarshipData from './StarshipData';

export interface Service {
  get: ReturnType<typeof getStarship>,
  getList: ReturnType<typeof getStarshipList>,
  create: ReturnType<typeof createStarship>,
  update: ReturnType<typeof updateStarship>,
  delete: ReturnType<typeof deleteStarship>
}

export const getStarship = (starships: Data) => starships.get;

export const getStarshipList = (starships: Data) => starships.getList;

export const createStarship = (starships: Data) => starships.create;

export const updateStarship = (starships: Data) => starships.update;

export const deleteStarship = (starships: Data) => starships.delete;


export async function create (
  starships: StarshipData.Data,
): Promise<Service> {
  return {
    get: getStarship(starships),
    getList: getStarshipList(starships),
    create: createStarship(starships),
    update: updateStarship(starships),
    delete: deleteStarship(starships)
  }
}

export default {create}