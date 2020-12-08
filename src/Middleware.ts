import {Request, Response, NextFunction} from 'express'
import {ValidationError} from 'joi';
import { resolve } from 'path';
// tslint:disable-next-line no-any
export type PromiseMiddleware = (req: Request, res: Response) => Promise<any>


export const handleValidatorErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (!err) {
    return next();
  }

  if(err instanceof ValidationError){
    res.status(400).json({ error: err.details,});
  } else
    throw err;
}
