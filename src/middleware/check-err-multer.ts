import type { NextFunction, Response } from 'express'
import { MulterError } from 'multer'

export const checkErrMulter = (
  err: unknown,
  req: unknown,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof MulterError) {
    res.status(400).json({ error: 'Error en la carga de archivos', message: err.message })
  } else next()
}
