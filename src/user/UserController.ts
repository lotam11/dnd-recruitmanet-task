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
      res.status(404);
      return;
    }

    if( authService.authenticate(hash, password))
      res.json({
        token: authService.getKey({identifier})
      })
    else
      res.status(403)
  }
}

export const register = (users: Service) => {
  const validation = joi.object().keys({ 
    identifier: joi.string().required(),
    password: joi.string().required() 
  });

  return async (req: Request, res: Response) => {
    joi.attempt(req.body, validation);
    const user = await users.create(req.body);
    response.status(200);
  }
}

export async function create (data: DataClient, authService: IAuthService) {
  const users = await UserController.create(data)

  return {
    register: register(users),
    authenticate: authenticate(users, authService)
  }
}

export default {create}