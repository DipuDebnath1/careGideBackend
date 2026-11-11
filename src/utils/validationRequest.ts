import { NextFunction, Request, Response } from 'express';
import { ZodObject } from 'zod';
import catchAsync from './catchAsync';

const validationRequest = (schema: ZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
    });
    next();
  });
};

export default validationRequest;
