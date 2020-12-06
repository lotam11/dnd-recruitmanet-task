import {Data, Person} from './PersonData';
import * as PersonData from './PersonData';

import {DataClient} from '../data/DataProvider'

export interface Service {
  get: ReturnType<typeof getPerson>,
  getList: ReturnType<typeof getPersonList>,
  create: ReturnType<typeof createPerson>,
}

export const getPerson = (persons: Data) => async (input: string) => {
  return persons.get(input)
}

export const getPersonList = (persons: Data) => 
  persons.getList;

export const createPerson = (persons: Data) => async (input?: Person) => {
  return persons.create(input)
}

export async function create (data: DataClient): Promise<Service> {
  const persons = await PersonData.create(data)

  return {
    get: getPerson(persons),
    getList: getPersonList(persons),
    create: createPerson(persons),
  }
}

export default {create}
