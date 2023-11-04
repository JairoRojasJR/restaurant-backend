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
import multer from 'multer'

const route = Router()

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fields: 2,
    files: 0
  }
})

route.get('/', getMenu)
route.post('/', upload.any(), validatorSchema(AddPlateToMenuSchema), addPlateToMenu)
route.put('/', validatorSchema(UpdatePlateFromMenuSchema), updatePlateFromMenu)
route.delete('/', validatorSchema(TypeMongooseIdInQuerySchema), removePlateToMenu)

export const menu = route
