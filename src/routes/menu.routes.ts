import { Router } from 'express'
import multer from 'multer'
import { checkAuth } from '@/middleware/auth.middleware'
import { validatorSchema } from '@/middleware/validator-schema.middleware'
import { AddPlateToMenuSchema, UpdatePlateFromMenuSchema } from '@/schemas/menu.schema'
import { TypeMongooseIdInQuerySchema } from '@/schemas'
import {
  addPlateToMenu,
  getMenu,
  removePlateToMenu,
  updatePlateFromMenu
} from '@/controllers/menu.controller'

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
route.post('/', checkAuth, upload.any(), validatorSchema(AddPlateToMenuSchema), addPlateToMenu)
route.put('/', checkAuth, validatorSchema(UpdatePlateFromMenuSchema), updatePlateFromMenu)
route.delete('/', checkAuth, validatorSchema(TypeMongooseIdInQuerySchema), removePlateToMenu)

export const menu = route
