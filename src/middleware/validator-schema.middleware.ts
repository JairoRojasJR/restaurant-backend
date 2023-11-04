import type { NextFunction, Request, Response } from 'express'
import { ZodError, type AnyZodObject } from 'zod'
import { getErrorMessage } from '@/utils'
import { type ResponseSchemaError } from '@/types'

export const validatorSchema =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      schema.parse({ body: req.body, params: req.params, query: req.query, file: req.file })
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        const schemaError: ResponseSchemaError = {
          name: e.name,
          errors: e.issues.map((issue) => ({ path: issue.path, message: issue.message }))
        }
        res.status(400).json(schemaError)
      } else res.status(400).json({ error: getErrorMessage(e) })
    }
  }
