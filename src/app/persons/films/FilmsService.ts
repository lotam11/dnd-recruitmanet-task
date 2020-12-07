import {Data} from './FilmsData';
import * as FilmData from './FilmsData';

export interface Service {
  get: ReturnType<typeof getFilm>,
  getList: ReturnType<typeof getFilmList>,
  create: ReturnType<typeof createFilm>,
  update: ReturnType<typeof updateFilm>,
  delete: ReturnType<typeof deleteFilm>
}

export const getFilm = (films: Data) => films.get;

export const getFilmList = (films: Data) => films.getList;

export const createFilm = (films: Data) => films.create;

export const updateFilm = (films: Data) => films.update;

export const deleteFilm = (films: Data) => films.delete;


export async function create (
  films: FilmData.Data,
): Promise<Service> {
  return {
    get: getFilm(films),
    getList: getFilmList(films),
    create: createFilm(films),
    update: updateFilm(films),
    delete: deleteFilm(films)
  }
}

export default {create}