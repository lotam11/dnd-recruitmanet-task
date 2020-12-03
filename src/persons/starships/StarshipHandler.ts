import {Request} from 'express'

import {DataClient} from '../../data/DataProvider'
import PersonController, {Controller} from './PersonController'

export const getCurrentPerson = (persons: Controller) => async (req: Request) => {
  return persons.get(req.body.id)
}

export const createPerson = (persons: Controller) => async (req: Request) => {
  const person = await persons.create()
  return person
}

export async function create (data: DataClient) {
  const persons = await PersonController.create(data)

  return {
    getCurrent: getCurrentPerson(persons),
    create: createPerson(persons),
  }
}

export default {create}