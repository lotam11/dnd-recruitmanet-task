import {request, Request, response, Response} from 'express'
import joi from 'joi';

import {DataClient} from '../data/DataProvider'
import { IAuthService } from './auth';
import UserController, {Service} from './UserService'

export const authenticate = (
  users: Service,
  authService: IAuthService
) => {
  const validation = joi.object().keys({ 
    identifier: joi.string().required(),
    password: joi.string().required() 
  });

  return async (req: Request, res: Response) => {
    joi.attempt(req.body, validation);

    const {identifier, password} = req.body;

    const hash = await users.getHash(identifier);

    if (hash == undefined || hash === "" ){
      res.status(404).end();
      return;
    }

    if( authService.authenticate(hash, password)){
      res.status(200).json({
        token: await authService.getKey({identifier})
      }).end();
    } else
      res.status(403).end();
  }
}

export const register = (users: Service) => {
  const validation = joi.object().keys({ 
    identifier: joi.string().required(),
    password: joi.string().required() 
  });

  return async (req: Request, res: Response, next: any) => {
    joi.attempt(req.body, validation);
    
    const user = await users.create(req.body);

    res.status(200).json({success: true});
  }
}

export async function create (
  data: DataClient, 
  authService: IAuthService
) {
  const users = await UserController.create(data)

  return {
    register: register(users),
    authenticate: authenticate(users, authService)
  }
}

export default {create}