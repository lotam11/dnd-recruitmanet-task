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

export function get(persons: Service){
  return async (req: Request, res: Response) =>
    res.json(
      await persons.get(req.params.id)
    ).end();
}

export async function create (data: DataClient) {
  const persons = await PersonService.create(data)

  return {
    get: get(persons),
    create: createPerson(persons)
  }
}

export default {create}