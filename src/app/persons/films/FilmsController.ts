import {Request, Response} from 'express'
import Joi from 'joi'

import {DataClient} from '../../../data/DataProvider'
import { PersonFilm as Film } from './FilmsData'
import {Service as FilmService} from './FilmsService'


export const createFilm = (films: FilmService) => { 
  const validation = Joi.object().keys({ 
    id: Joi.number().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    release_date: Joi.number(), 
  });

  return async (req: Request, res: Response) => {
    const {person_id} = req.context;

    if( !person_id || isNaN(+person_id) ){
      res.status(404).end();
      return;
    }

    Joi.attempt(req.body, validation);

    const film = await films.create(req.body, person_id)
    
    res.json(film).end();
  }
}

export const updateFilm = (films: FilmService) => { 
  const validation = Joi.object().keys({ 
    nickname: Joi.string().required(),
    fullname: Joi.string().required(),
    description: Joi.string().required(), 
    id: Joi.number().required(),
  });

  return async (req: Request, res: Response) => {
    const {person_id} = req.context;

    if( !person_id || isNaN(+person_id) ){
      res.status(404).end();
      return;
    }

    const input = {...req.body, id: req.params.id}

    Joi.attempt(input, validation);

    const film = await films.update(input, parseInt(person_id));
    
    res.json(film).end();
  }
}

export function getFilm(films: FilmService){
  return async (req: Request, res: Response) => {
    const {person_id} = req.context;

    if( !person_id || isNaN(+person_id) ){
      res.status(404).end();
      return;
    }

    res.json(
      await films.get(parseInt(req.params.id), parseInt(person_id))
    ).end();
  }
}

export function getFilmList(films: FilmService) {
  return async (req: Request, res: Response) => {
    const {person_id} = req.context;

    if( !person_id || isNaN(+person_id) ){
      res.status(404).end();
      return;
    }

    res.json(
      await films.getList({
        offset: parseInt(req.query.query as string),
        limit: parseInt(req.query.limit as string),
        person_id: parseInt(person_id)
      })
    ).end();
  }
}

export function deleteFilm(films: FilmService) {
  return async (req: Request, res:Response) => {
    const {person_id} = req.context;

    if( !person_id || isNaN(+person_id) ){
      res.status(404).end();
      return;
    }

    const id = parseInt(req.params.id);

    await films.delete(id);
    res.status(200).end()

  }
}

export async function create (films: FilmService) {

  return {
    get: getFilm(films),
    create: createFilm(films),
    getList: getFilmList(films),
    update: updateFilm(films),
    delete: deleteFilm(films)
  }
}

export default {create}