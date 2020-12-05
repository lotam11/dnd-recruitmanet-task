import {Request, Response, NextFunction} from 'express'
import {ValidationError} from 'joi';
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

  console.log("!!!ERROR!!!", typeof(err));
  if(err instanceof ValidationError){
    console.log("!!!VALIDATIION!!!");

    res.status(400).json({ error: err.details,});
  }
}
export default {promise}