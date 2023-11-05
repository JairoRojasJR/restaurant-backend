import type { NextFunction, Request, Response } from 'express'

export const validatorContenType =
  (contentType: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const contentTypeInHeader = req.headers['content-type']

    if (contentTypeInHeader === undefined) {
      res.status(400).json({ error: 'No se encontró la cabecera Content-Type' })
      return
    }

    const matchContentType = contentTypeInHeader.includes(contentType)

    if (matchContentType) next()
    else {
      const errorMsg = `El tipo de contenido (${contentTypeInHeader}), no coincide con el tipo esperado (${contentType})`
      res.status(400).json({ error: errorMsg })
    }
  }
