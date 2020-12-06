import bcrypt from 'bcrypt';
import { string } from 'joi';
import jwt from 'jsonwebtoken';
import {IAuthService} from "."

export const authenticate = () => 
  async (hash: string, password: string) =>
    bcrypt.compareSync(
      password,
      hash
    )

export const getKey = (secretKey: string, expiresIn: number) => 
    async(data: Object) => { 
      return jwt.sign(data, secretKey, {expiresIn})
    };


interface JWTAuthServiceConfiguation {
  secretkey: string,
  expiresIn: number
}

export function create(config: JWTAuthServiceConfiguation): IAuthService {
  return {
    authenticate: authenticate(),
    getKey: getKey(config.secretkey, config.expiresIn)
  }
}