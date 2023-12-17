import { Router } from 'express'
import multer from 'multer'
import { checkAuth } from '@/middleware/auth.middleware'
import { validatorContenType } from '@/middleware/validator-content-type'
import { validatorSchema } from '@/middleware/validator-schema.middleware'
import { checkErrMulter } from '@/middleware/check-err-multer'
import { addPlate, deletePlate, getPlates, updatePlate } from '@/controllers/plate.controller'
import { AddPlateSchema, GetPlateSchema, UpdatePlateSchema } from '@/schemas/plates.schema'
import { TypeMongooseIdInQuerySchema } from '@/schemas'

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fields: 2,
    fileSize: 10000000,
    files: 1
  }
})

router.get('/', validatorSchema(GetPlateSchema), getPlates)
router.post(
  '/',
  checkAuth,
  validatorContenType('multipart/form-data'),
  upload.single('image'),
  validatorSchema(AddPlateSchema),
  addPlate
)
router.put('/', checkAuth, upload.single('image'), validatorSchema(UpdatePlateSchema), updatePlate)
router.delete('/', checkAuth, validatorSchema(TypeMongooseIdInQuerySchema), deletePlate)

router.use(checkErrMulter)

export const plates = router
