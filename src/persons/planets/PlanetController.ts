import {Data, GetListInput, PersonStarship} from './StarshipData';
import * as StarshipData from './StarshipData';

import {DataClient} from '../../data/DataProvider'

export interface Controller {
  get: ReturnType<typeof getStarship>,
  getList: ReturnType<typeof getStarshipList>,
  create: ReturnType<typeof createStarship>,
}

export const getStarship = (starships: Data) => async (input: string) => {
  return starships.get(input)
}

export const getStarshipList = (starships: Data) => async (input?: GetListInput) => {
  return starships.getList(input)
}

export const createStarship = (starships: Data) => async (input?: PersonStarship) => {
  return starships.create(input)
}

export async function create (data: DataClient): Promise<Controller> {
  const Starships = await StarshipData.create(data)

  return {
    get: getStarship(Starships),
    getList: getStarshipList(Starships),
    create: createStarship(Starships),
  }
}

export default {create}
