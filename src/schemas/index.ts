import { Types } from 'mongoose'
import { z } from 'zod'

export const zIsMongooseTypeId = z.string().refine((_id) => Types.ObjectId.isValid(_id), {
  message: 'id inválido, tiene que ser un id válido de mongoose'
})

export const TypeMongooseIdSchema = z.object({ _id: zIsMongooseTypeId })
export const TypeMongooseIdInQuerySchema = z.object({ query: TypeMongooseIdSchema })

export type TypeMongooseIdType = z.infer<typeof TypeMongooseIdSchema>
export type TypeMongooseIdInQueryType = z.infer<typeof TypeMongooseIdInQuerySchema>['query']
