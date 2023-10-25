import { z } from 'zod'
import { invalidHourFormatMsg, validateHourFormat } from '@/utils'
import { companyKeys, shopStatus } from '@/consts'
import { type ShopStatus } from '@/types'

export const GetCompanySchema = z.object({
  query: z.object({
    query: z
      .union([
        z.literal(companyKeys[0]),
        z.literal(companyKeys[1]),
        z.literal(companyKeys[2]),
        z.literal(companyKeys[3])
      ])
      .optional()
  })
})

export const AddCompanySchema = z.object({
  body: z
    .object({
      name: z.string().min(4),
      address: z.string().min(5),
      schedules: z.array(
        z.object({
          name: z.string(),
          opening: z.string().refine(validateHourFormat, {
            message: invalidHourFormatMsg
          }),
          closing: z.string().refine(validateHourFormat, {
            message: invalidHourFormatMsg
          })
        })
      ),
      workdays: z.array(
        z.object({
          day: z.string().min(5),
          schedule: z.string()
        })
      ),
      status: z.string()
    })
    .refine((data) => shopStatus.includes(data.status as ShopStatus), {
      message: 'Status inválido',
      path: ['status']
    })
})

export type GetCompanyQueryType = z.infer<typeof GetCompanySchema>['query']
export type AddCompanyType = z.infer<typeof AddCompanySchema>['body']
