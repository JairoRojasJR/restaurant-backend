import { dropCollection } from '@/controllers/db.controller'
import { validatorSchema } from '@/middleware/validator-schema.middleware'
import { DropCollectionSchema } from '@/schemas/db.schema'
import { Router } from 'express'

const route = Router()

route.post('/collection/drop', validatorSchema(DropCollectionSchema), dropCollection)

export const db = route
