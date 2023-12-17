import type { NextFunction, Request, Response } from 'express'

export const checkAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.isAuthenticated()) {
    next()
    return
  }

  res.status(401).json({ error: 'Usuario no autenticado' })
}
