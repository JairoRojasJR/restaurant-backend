import { Router } from 'express'
import { checkAuth } from '@/middleware/auth.middleware'
import { validatorSchema } from '@/middleware/validator-schema.middleware'
import { AddCompanySchema, GetCompanySchema, UpdateCompanySchema } from '@/schemas/company.schema'
import {
  addCompany,
  getCompany,
  getSchedules,
  getWorkdays,
  updateCompany
} from '@/controllers/company.controller'

const route = Router()

route.get('/', validatorSchema(GetCompanySchema), getCompany)
route.post('/', checkAuth, validatorSchema(AddCompanySchema), addCompany)
route.put('/', checkAuth, validatorSchema(UpdateCompanySchema), updateCompany)
route.get('/schedule', getSchedules)
route.get('/workday', getWorkdays)

export const company = route
