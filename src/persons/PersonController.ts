import {Request, Response} from 'express'
import Joi from 'joi'

import {DataClient} from '../data/DataProvider'
import PersonService, {Service} from './PersonService'


export const createPerson = (persons: Service) => { 
  const validation = Joi.object().keys({ 
    nickname: Joi.string().required(),
    fullname: Joi.string().required(),
    description: Joi.string().required() 
  });

  return async (req: Request, res: Response) => {
    Joi.attempt(req.body, validation);

    const person = await persons.create(req.body)
    
    res.json(person).end();
  }
}

export const updatePerson = (persons: Service) => { 
  const validation = Joi.object().keys({ 
    nickname: Joi.string().required(),
    fullname: Joi.string().required(),
    description: Joi.string().required(), 
    id: Joi.number().required(),
  });

  return async (req: Request, res: Response) => {
    const input = {...req.body, id: req.params.id}

    Joi.attempt(input, validation);

    const person = await persons.update(input)
    
    res.json(person).end();
  }
}

export function getPerson(persons: Service){
  return async (req: Request, res: Response) =>
    res.json(
      await persons.get(req.params.id)
    ).end();
}

export function getPersonList(persons: Service) {
  return async (req: Request, res: Response) =>
    res.json(
      await persons.getList({
        offset: parseInt(req.query.query as string),
        limit: parseInt(req.query.limit as string)
      })
    ).end();
}

export async function create (data: DataClient) {
  const persons = await PersonService.create(data)

  return {
    get: getPerson(persons),
    create: createPerson(persons),
    getList: getPersonList(persons),
    update: updatePerson(persons)
  }
}

export default {create}