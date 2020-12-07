import {Data} from './VehiculeData';
import * as VehiculeData from './VehiculeData';

export interface Service {
  get: ReturnType<typeof getVehicule>,
  getList: ReturnType<typeof getVehiculeList>,
  create: ReturnType<typeof createVehicule>,
  update: ReturnType<typeof updateVehicule>,
  delete: ReturnType<typeof deleteVehicule>
}

export const getVehicule = (vehicules: Data) => vehicules.get;

export const getVehiculeList = (vehicules: Data) => vehicules.getList;

export const createVehicule = (vehicules: Data) => vehicules.create;

export const updateVehicule = (vehicules: Data) => vehicules.update;

export const deleteVehicule = (vehicules: Data) => vehicules.delete;


export async function create (
  vehicules: VehiculeData.Data,
): Promise<Service> {
  return {
    get: getVehicule(vehicules),
    getList: getVehiculeList(vehicules),
    create: createVehicule(vehicules),
    update: updateVehicule(vehicules),
    delete: deleteVehicule(vehicules)
  }
}

export default {create}
