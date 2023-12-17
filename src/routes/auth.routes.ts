import { Router } from 'express'
import multer from 'multer'
import { checkAuth } from '@/middleware/auth.middleware'
import { validatorSchema } from '@/middleware/validator-schema.middleware'
import { LoginSchema, StatusSchema } from '@/schemas/auth.schema'
import { status, login, logout } from '@/controllers/auth.controllers'

const router = Router()

router.get('/status', validatorSchema(StatusSchema), status)

router.post('/login', multer().none(), validatorSchema(LoginSchema), login)

router.get('/logout', checkAuth, logout)

export const auth = router
