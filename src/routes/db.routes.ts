import { Router } from 'express'
import { checkAuth } from '@/middleware/auth.middleware'
import { validatorSchema } from '@/middleware/validator-schema.middleware'
import { DropCollectionSchema } from '@/schemas/db.schema'
import { dropCollection } from '@/controllers/db.controller'

const route = Router()

route.post('/collection/drop', checkAuth, validatorSchema(DropCollectionSchema), dropCollection)

export const db = route
