import {Request} from 'express'

import {DataClient} from '../../../data/DataProvider'
import StarshipController, {Controller} from './StarshipController'

export const getCurrentStarship = (starships: Controller) => async (req: Request) => {
  return starships.get(req.body.id)
}

export const createStarship = (starships: Controller) => async (req: Request) => {
  const starship = await starships.create()
  return starship
}

export async function create (data: DataClient) {
  const starships = await StarshipController.create(data)

  return {
    getCurrent: getCurrentStarship(starships),
    create: createStarship(starships),
  }
}

export default {create}