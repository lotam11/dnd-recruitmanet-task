import {Request} from 'express'

import {DataClient} from '../../../data/DataProvider'
import FilmsController, {Controller} from './FilmsController'

export const getCurrentFilms = (filmss: Controller) => async (req: Request) => {
  return filmss.get(req.body.id)
}

export const createFilms = (filmss: Controller) => async (req: Request) => {
  const films = await filmss.create()
  return films
}

export async function create (data: DataClient) {
  const filmss = await FilmsController.create(data)

  return {
    getCurrent: getCurrentFilms(filmss),
    create: createFilms(filmss),
  }
}

export default {create}