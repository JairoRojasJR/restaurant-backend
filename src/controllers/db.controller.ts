import type { Response, Request } from 'express'
import { type DropCollectionType } from '@/schemas/db.schema'
import connection from '@/utils/db'
import { getErrorMessage } from '@/utils'

export const dropCollection = async (
  req: Request<unknown, unknown, DropCollectionType>,
  res: Response
): Promise<Response> => {
  const collectionsToDelete = req.body

  const errors: string[] = []

  for (const collection of collectionsToDelete) {
    try {
      await connection.db.collection(collection).drop()
    } catch (e) {
      errors.push(getErrorMessage(e))
    }
  }

  if (errors.length === 0) return res.json({ message: 'Colecciones eliminadas exitosamente' })
  else return res.status(400).json(errors)
}
