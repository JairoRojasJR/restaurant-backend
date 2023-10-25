import { platesOrder } from '@/consts'
import { type PlateOrder } from '@/types'
import { Types } from 'mongoose'
import { z } from 'zod'

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

const idInQuery = z
  .object({
    _id: z.string()
  })
  .refine((data) => Types.ObjectId.isValid(data._id), {
    message: 'id inválido, tiene que ser un id válido de mongoose',
    path: ['id']
  })

export const UpdatePlateSchema = z.object({
  query: idInQuery,
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

export const DeletePlateSchema = z.object({ query: idInQuery })

export type AddPlateType = z.infer<typeof AddPlateSchema>['body']
export type UpdatePlateBodyType = z.infer<typeof UpdatePlateSchema>['body']
export type UpdatePlateQueryType = z.infer<typeof UpdatePlateSchema>['query']
export type DeletePlateQueryType = z.infer<typeof UpdatePlateSchema>['query']
