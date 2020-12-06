import {Request, Response, NextFunction} from 'express'
import {ValidationError} from 'joi';
import { resolve } from 'path';
// tslint:disable-next-line no-any
export type PromiseMiddleware = (req: Request, res: Response) => Promise<any>

export const promise = (middleware: PromiseMiddleware) => (
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await middleware(req, res);

      if (result) {
        res.json(result);
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  }
)

export const handleValidatorErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (!err) {
    return next();
  }

  if(err instanceof ValidationError){
    res.status(400).json({ error: err.details,});
  } else
    throw err;
}
export default {promise}

export function wrapAsync(fn: any)  {
  async function asyncifyWrap(req: any, res: any, next: any) {
    try {
      return await fn.apply(null, arguments)
    } catch (err) {
      next(err)
    }
  }
  return asyncifyWrap
}
//   console.log(fn);
//   return async function(req: any, res: any, next: any) {
//     // Make sure to `.catch()` any errors and pass them along to the `next()`
//     // middleware in the chain, in this case the error handler.
//     const result = fn(req, res);

//     Promise.resolve(result).catch(next);
//   };
// }