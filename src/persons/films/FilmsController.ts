import {Data, GetListInput, PersonFilm} from './FilmsData';
import * as FilmData from './FilmsData';

import {DataClient} from '../../data/DataProvider'

export interface Controller {
  get: ReturnType<typeof getFilm>,
  getList: ReturnType<typeof getFilmList>,
  create: ReturnType<typeof createFilm>,
}

export const getFilm = (films: Data) => async (input: string) => {
  return films.get(input)
}

export const getFilmList = (films: Data) => async (input?: GetListInput) => {
  return films.getList(input)
}

export const createFilm = (films: Data) => async (input?: PersonFilm) => {
  return films.create(input)
}

export async function create (data: DataClient): Promise<Controller> {
  const Films = await FilmData.create(data)

  return {
    get: getFilm(Films),
    getList: getFilmList(Films),
    create: createFilm(Films),
  }
}

export default {create}
