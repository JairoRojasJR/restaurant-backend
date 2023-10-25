import type { Response, Request } from 'express'
import { Error } from 'mongoose'
import { type DropCollectionType } from '@/schemas/db.schema'
import connection from '@/utils/db'

export const dropCollection = async (
  req: Request<unknown, unknown, DropCollectionType>,
  res: Response
): Promise<Response> => {
  const collectionsToDelete = req.body

  const errors: Error[] = []

  for (const collection of collectionsToDelete) {
    try {
      await connection.db.collection(collection).drop()
    } catch (error) {
      console.error(error)
      if (error instanceof Error) errors.push(error)
    }
  }

  if (errors.length === 0) return res.json({ message: 'Colecciones eliminadas exitosamente' })
  else return res.json(errors)
}
