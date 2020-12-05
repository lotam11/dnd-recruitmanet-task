import {request, Request} from 'express'
import joi from 'joi';

import {DataClient} from '../data/DataProvider'
import UserController, {Controller} from './UserController'

export const authenticate = (users: Controller, secretKey: string) => {
  const validation = joi.object().keys({ 
    identifier: joi.string().required(),
    password: joi.string().required() 
  });

  return async (req: Request) => {
    joi.attempt(req.body, validation);
    const {identifier, password} = req.body;
    return users.authenticate( {identifier, password} )
  }
}

export const register = (users: Controller) => {
  const validation = joi.object().keys({ 
    identifier: joi.string().required(),
    password: joi.string().required() 
  });

  return async (req: Request) => {
    joi.attempt(req.body, validation);
    const user = await users.create(req.body)
    return user
  }
}

export async function create (data: DataClient, secretKey: string) {
  const users = await UserController.create(data, secretKey)

  return {
    register: register(users),
    authenticate: authenticate(users, secretKey)
  }
}

export default {create}