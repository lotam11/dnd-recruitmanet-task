import {request, Request} from 'express'

import {DataClient} from '../data/DataProvider'
import UserController, {Controller} from './UserController'

export const authenticate = (users: Controller, secretKey: string) => async (req: Request) => {
  const {identifier, password} = req.body;
  return users.authenticate( {identifier, password} )
}

export const createUser = (users: Controller) => async (req: Request) => {
  const user = await users.create(req.body)
  return user
}

export async function create (data: DataClient, secretKey: string) {
  const users = await UserController.create(data, secretKey)

  return {
    create: createUser(users),
    authenticate: authenticate(users, secretKey)
  }
}

export default {create}