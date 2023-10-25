import { stream } from '@/controllers/stream.controller'
import { Router } from 'express'

const router = Router()

router.get('/image/*', stream)

export const streaming = router
