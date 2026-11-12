import { NextFunction, Request, Response } from 'express';

const catchAsync =
  <T extends Request = Request>(
    fn: (req: T, res: Response, next: NextFunction) => unknown
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as T, res, next)).catch((err) => next(err));
  };

export default catchAsync;
