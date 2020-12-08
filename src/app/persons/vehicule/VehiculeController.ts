import {Request, Response} from 'express'
import Joi from 'joi'
import {Service as VehiculeService} from './VehiculeService'


export const createVehicule = (vehicules: VehiculeService) => { 
  const validation = Joi.object().keys({ 
    name: Joi.number().required(),
    year_of_production: Joi.string().required(),
    description: Joi.string().required(),
    speed: Joi.number().required(), 
  });

  return async (req: Request, res: Response) => {
    Joi.attempt(req.body, validation);

    const {person_id} = req.params;

    if( isNaN(+person_id) ){
      res.status(404).end();
      return;
    }

    const vehicule = await vehicules.create(person_id, req.body)
    
    res.json(vehicule).end();
  }
}

export const updateVehicule = (vehicules: VehiculeService) => { 
  const validation = Joi.object().keys({ 
    name: Joi.number().required(),
    year_of_production: Joi.string().required(),
    description: Joi.string().required(),
    speed: Joi.number().required(), 
    id: Joi.number().required(),
  });

  return async (req: Request, res: Response) => {

    const {person_id} = req.params;

    if( isNaN(+person_id) ){
      res.status(404).end();
      return;
    }

    const input = {...req.body, id: req.params.id}

    Joi.attempt(input, validation);

    const vehicule = await vehicules.update(input,parseInt(person_id))
    
    res.json(vehicule).end();
  }
}

export function getVehicule(vehicules: VehiculeService){
  return async (req: Request, res: Response) => {
    const {person_id} = req.params;

    if( isNaN(+person_id) ){
      res.status(404).end();
      return;
    }

    res.json(
      await vehicules.get(req.params.id, parseInt(person_id))
    ).end();
  }
}

export function getVehiculeList(vehicules: VehiculeService) {
  return async (req: Request, res: Response) => {
    const {person_id} = req.params;

    if( isNaN(+person_id) ){
      res.status(404).end();
      return;
    }

    res.json(
      await vehicules.getList({
        offset: parseInt(req.query.query as string),
        limit: parseInt(req.query.limit as string),
        person_id
      })
    ).end();
  }
}

export function deleteVehicule(vehicules: VehiculeService) {
  return async (req: Request, res:Response) => {
    if(isNaN(+req.params.id)){
      res.status(400).json({error: "id must be a number"}).end();
      return
    }

    const id = parseInt(req.params.id);

    await vehicules.delete(id);
    res.status(200).end()

  }
}

export async function create (vehicules: VehiculeService) {

  return {
    get: getVehicule(vehicules),
    create: createVehicule(vehicules),
    getList: getVehiculeList(vehicules),
    update: updateVehicule(vehicules),
    delete: deleteVehicule(vehicules)
  }
}

export default {create}