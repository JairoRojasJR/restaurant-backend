import { z } from 'zod'
import { TypeMongooseIdSchema as query, zRequriedObjectSchema } from '.'
import { platesOrder } from '@/consts'
import { type PlateOrder } from '@/types'
import { getInvalidTypeError, getMinError, getRequiredError } from '@/utils'

const zPlateName = z
  .string({
    invalid_type_error: getInvalidTypeError('string'),
    required_error: getRequiredError()
  })
  .min(4, getMinError(4))

const zPlateOrder = z
  .string({
    invalid_type_error: getInvalidTypeError('string'),
    required_error: getRequiredError()
  })
  .refine((order) => platesOrder.includes(order as PlateOrder), {
    message: `Valor inválido, se esperaba ${platesOrder[0]} o ${platesOrder[1]}`
  })

export const GetPlateSchema = z.object({
  query: z
    .object({
      name: zPlateName.optional(),
      order: zPlateOrder.optional()
    })
    .optional()
})

export const AddPlateSchema = z.object({
  body: z.object({
    name: zPlateName,
    order: zPlateOrder
  }),
  file: z
    .object({
      fieldname: z
        .string({
          invalid_type_error: getInvalidTypeError('string'),
          required_error: getRequiredError()
        })
        .min(4, getMinError(4)),
      mimetype: z.string({
        invalid_type_error: getInvalidTypeError('string'),
        required_error: getRequiredError()
      })
    })
    .refine((data) => data.mimetype.includes('image/'), {
      message: 'Tipo de archivo inesperado',
      path: ['image']
    })
    .or(zRequriedObjectSchema('image'))
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

export type GetPlateQueryType = z.infer<typeof GetPlateSchema>['query']
export type AddPlateType = z.infer<typeof AddPlateSchema>['body']
export type UpdatePlateBodyType = z.infer<typeof UpdatePlateSchema>['body']
