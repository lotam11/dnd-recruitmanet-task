import {Data, Person} from './PersonData';
import * as PersonData from './PersonData';

import {DataClient} from '../../data/DataProvider'
import { preferences } from 'joi';
import { ICacheService } from '../../cache';

export interface Service {
  get: ReturnType<typeof getPerson>,
  getList: ReturnType<typeof getPersonList>,
  create: ReturnType<typeof createPerson>,
  update: ReturnType<typeof updatePerson>,
  delete: ReturnType<typeof deletePerson>
}

export const getPerson = (persons: Data) => persons.get;

export const getPersonList = (persons: Data) => persons.getList;

export const createPerson = (persons: Data) => persons.create;

export const updatePerson = (persons: Data) => persons.update;

export const deletePerson = (persons: Data) => persons.delete;


export async function create (
  persons: PersonData.Data,
): Promise<Service> {
  return {
    get: getPerson(persons),
    getList: getPersonList(persons),
    create: createPerson(persons),
    update: updatePerson(persons),
    delete: deletePerson(persons)
  }
}

export default {create}
