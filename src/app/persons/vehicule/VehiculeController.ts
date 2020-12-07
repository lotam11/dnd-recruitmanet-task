import {Data, GetListInput, PersonVehicule} from './VehiculeData';
import * as VehiculeData from './VehiculeData';

import {DataClient} from '../../../data/DataProvider'

export interface Controller {
  get: ReturnType<typeof getVehicule>,
  getList: ReturnType<typeof getVehiculeList>,
  create: ReturnType<typeof createVehicule>,
}

export const getVehicule = (vehicules: Data) => async (input: string) => {
  return vehicules.get(input)
}

export const getVehiculeList = (vehicules: Data) => async (input?: GetListInput) => {
  return vehicules.getList(input)
}

export const createVehicule = (vehicules: Data) => async (input?: PersonVehicule) => {
  return vehicules.create(input)
}

export async function create (data: DataClient): Promise<Controller> {
  const Vehicules = await VehiculeData.create(data)

  return {
    get: getVehicule(Vehicules),
    getList: getVehiculeList(Vehicules),
    create: createVehicule(Vehicules),
  }
}

export default {create}
