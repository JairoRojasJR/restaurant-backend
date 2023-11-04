import { getRequiredError } from '@/utils'
import { Types } from 'mongoose'
import { z } from 'zod'

export const zIsMongooseTypeId = z.string().refine((_id) => Types.ObjectId.isValid(_id), {
  message: 'id inválido, tiene que ser un id válido de mongoose'
})
export const zRequriedObjectSchema = (path: string): z.ZodEffects<z.ZodUndefined> => {
  return z
    .undefined()
    .refine((data) => !(data === undefined), { message: getRequiredError(), path: [path] })
}

export const TypeMongooseIdSchema = z.object({ _id: zIsMongooseTypeId })
export const TypeMongooseIdInQuerySchema = z.object({ query: TypeMongooseIdSchema })

export type TypeMongooseIdType = z.infer<typeof TypeMongooseIdSchema>
export type TypeMongooseIdInQueryType = z.infer<typeof TypeMongooseIdInQuerySchema>['query']
