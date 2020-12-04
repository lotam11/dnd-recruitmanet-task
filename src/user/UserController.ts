import {Data, UserInput, User} from './UserData';
import * as UserData from './UserData';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {DataClient} from '../data/DataProvider'

export interface Controller {
  authenticate: ReturnType<typeof authenticate>,
  create: ReturnType<typeof createUser>,
}
interface AuthenticationInput {
  identifier: string,
  password: string
}

export const authenticate = (users: Data, secretKey: string) => async (input: AuthenticationInput) => {
  const hash = await users.getHash(input.identifier);
  const isAuthenticated = bcrypt.compareSync(
    input.password,
    hash
  )

  if (isAuthenticated) {
    jwt.sign({identifier: input.identifier}, secretKey,{expiresIn: 300});
  }
}

export const createUser = (users: Data) => async (input: AuthenticationInput) => {
  const hash = bcrypt.hashSync(input.password, 10)

  return users.create({
    identifier: input?.identifier,
    hash
  })
}

export async function create (
  data: DataClient,
  secretKey: string
): Promise<Controller> {
  const users = await UserData.create(data)

  return {
    authenticate: authenticate(users, secretKey),
    create: createUser(users),
  }
}

export default {create}
