import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Middleware to validate request using Zod schema
 */
export const validateRequest = (schema: ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      next(error);
    }
  };
};
