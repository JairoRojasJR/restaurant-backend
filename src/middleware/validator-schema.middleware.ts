import type { NextFunction, Request, Response } from 'express'
import { ZodError, type AnyZodObject } from 'zod'

export const validatorSchema =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      schema.parse({ body: req.body, params: req.params, query: req.query, file: req.file })
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        res.status(400).json(e.issues)
      }
    }
  }
