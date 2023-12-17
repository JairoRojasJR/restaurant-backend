import { getInvalidTypeError, getRequiredError } from '@/utils'
import { z } from 'zod'

export const StatusSchema = z.object({
  query: z.object({
    sessionId: z
      .string({
        invalid_type_error: getInvalidTypeError('string'),
        required_error: getRequiredError()
      })
      .optional()
  })
})

export const LoginSchema = z.object({
  body: z.object({
    username: z
      .string({
        invalid_type_error: getInvalidTypeError('string'),
        required_error: getRequiredError()
      })
      .min(4),
    password: z
      .string({
        invalid_type_error: getInvalidTypeError('string'),
        required_error: getRequiredError()
      })
      .min(4)
  })
})

export type StatusSchemaType = z.infer<typeof StatusSchema>['query']
export type LoginSchemaType = z.infer<typeof LoginSchema>['body']
