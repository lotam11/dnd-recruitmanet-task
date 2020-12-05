import {Data, UserInput, User} from './UserData';
import * as UserData from './UserData';
import bcrypt from 'bcrypt';
import {DataClient} from '../data/DataProvider'
import {IAuthService} from "./auth/index"

interface AuthenticationInput {
  identifier: string,
  password: string
}

export const getHash = (users: Data) => 
  async (identifier: string) => {
    return await users.getHash(identifier);
  }

export const createUser = (users: Data) => 
  async (input: AuthenticationInput) => {
    const hash = bcrypt.hashSync(input.password, 10)

    return await users.create({
      identifier: input?.identifier,
      hash
    })
  }

export interface Service {
  getHash: ReturnType<typeof getHash>,
  create: ReturnType<typeof createUser>,
}
  
export async function create (
  data: DataClient,
): Promise<Service> {
  const users = await UserData.create(data)

  return {
    getHash: getHash(users),
    create: createUser(users),
  }
}

export default {create}
