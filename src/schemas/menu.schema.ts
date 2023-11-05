import { z } from 'zod'
import { zIsMongooseTypeId, TypeMongooseIdSchema as query } from '@/schemas'
import { menuStates } from '@/consts'

export const AddPlateToMenuSchema = z.object({
  body: z.object({
    plate: zIsMongooseTypeId,
    status: z.union([z.literal(menuStates[0]), z.literal(menuStates[1])])
  })
})

export const UpdatePlateFromMenuSchema = z.object({
  query,
  body: z.object({
    plate: zIsMongooseTypeId.optional(),
    status: z.union([z.literal(menuStates[0]), z.literal(menuStates[1])]).optional()
  })
})

export type AddPlateToMenuBodyType = z.infer<typeof AddPlateToMenuSchema>['body']
export type UpdatePlateFromMenuBodyType = z.infer<typeof UpdatePlateFromMenuSchema>['body']
export type UpdatePlateFromMenuQueryType = z.infer<typeof UpdatePlateFromMenuSchema>['query']
