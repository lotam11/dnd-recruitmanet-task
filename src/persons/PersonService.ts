import {Data, Person} from './PersonData';
import * as PersonData from './PersonData';

import {DataClient} from '../data/DataProvider'

export interface Service {
  get: ReturnType<typeof getPerson>,
  getList: ReturnType<typeof getPersonList>,
  create: ReturnType<typeof createPerson>,
  update: ReturnType<typeof updatePerson>
}

export const getPerson = (persons: Data) => persons.get

export const getPersonList = (persons: Data) => persons.getList;

export const createPerson = (persons: Data) => persons.create

export const updatePerson = (persons: Data) => persons.update


export async function create (data: DataClient): Promise<Service> {
  const persons = await PersonData.create(data)

  return {
    get: getPerson(persons),
    getList: getPersonList(persons),
    create: createPerson(persons),
    update: updatePerson(persons)
  }
}

export default {create}
