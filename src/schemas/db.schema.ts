import { z } from 'zod'

export const DropCollectionSchema = z.object({
  body: z.array(z.string().min(2))
})

export type DropCollectionType = z.infer<typeof DropCollectionSchema>['body']
