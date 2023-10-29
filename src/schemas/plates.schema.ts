import { z } from 'zod'
import { TypeMongooseIdSchema as query } from '.'
import { platesOrder } from '@/consts'
import { type PlateOrder } from '@/types'

export const AddPlateSchema = z.object({
  body: z
    .object({
      name: z.string().min(4),
      order: z.string()
    })
    .refine((data) => platesOrder.includes(data.order as PlateOrder), {
      message: 'Order inválida',
      path: ['order']
    }),
  file: z
    .object({
      fieldname: z.string().min(4),
      mimetype: z.string()
    })
    .refine((data) => data.mimetype.includes('image/'), {
      message: 'Tipo de archivo inesperado',
      path: ['mimetype']
    })
})

export const UpdatePlateSchema = z.object({
  query,
  body: z
    .object({
      name: z.string().min(4).optional(),
      order: z.union([z.literal(platesOrder[0]), z.literal(platesOrder[1])]).optional(),
      image: z.any().optional()
    })
    .refine((data) => data.image === undefined, {
      message: 'Campo imagen recibido de forma inesperada, asegurece de usar multipart/form-data',
      path: ['image']
    })
    .refine(
      (data) => {
        return !(data.name === undefined && data.order === undefined)
      },
      {
        message: 'Se requiere una propiedad a actualizar, se recibió 0',
        path: ['name', 'order']
      }
    ),
  file: z
    .object({
      fieldname: z.string().min(4),
      mimetype: z.string()
    })
    .refine((data) => data.mimetype.includes('image/'), {
      message: 'Tipo de archivo inesperado',
      path: ['mimetype']
    })
    .optional()
})

export type AddPlateType = z.infer<typeof AddPlateSchema>['body']
export type UpdatePlateBodyType = z.infer<typeof UpdatePlateSchema>['body']
