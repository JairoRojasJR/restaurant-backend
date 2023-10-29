import {
  addPlateToMenu,
  getMenu,
  removePlateToMenu,
  updatePlateFromMenu
} from '@/controllers/menu.controller'
import { validatorSchema } from '@/middleware/validator-schema.middleware'
import { AddPlateToMenuSchema, UpdatePlateFromMenuSchema } from '@/schemas/menu.schema'
import { TypeMongooseIdInQuerySchema } from '@/schemas'
import { Router } from 'express'

const route = Router()

route.get('/', getMenu)
route.post('/', validatorSchema(AddPlateToMenuSchema), addPlateToMenu)
route.put('/', validatorSchema(UpdatePlateFromMenuSchema), updatePlateFromMenu)
route.delete('/', validatorSchema(TypeMongooseIdInQuerySchema), removePlateToMenu)

export const menu = route
