import {Context} from 'koa'

import {DataClient} from '../data'
import PersonController, {Controller} from './PersonController'

export const getCurrentPerson = (persons: Controller) => async (req: Request) => {
  const id = req.session && req.session.personId

  return id && persons.get({id})
}

export const createPerson = (persons: Controller) => async (req: Request) => {
  const person = await persons.create()

  if (!req.session) req.session = {}
  req.session.personId = person.id

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