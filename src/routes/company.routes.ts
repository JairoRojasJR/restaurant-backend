import {
  addCompany,
  getCompany,
  getSchedules,
  getWorkdays,
  updateCompany
} from '@/controllers/company.controller'
import { validatorSchema } from '@/middleware/validator-schema.middleware'
import { AddCompanySchema, GetCompanySchema, UpdateCompanySchema } from '@/schemas/company.schema'
import { Router } from 'express'

const route = Router()

route.get('/', validatorSchema(GetCompanySchema), getCompany)
route.post('/', validatorSchema(AddCompanySchema), addCompany)
route.put('/', validatorSchema(UpdateCompanySchema), updateCompany)
route.get('/schedule', getSchedules)
route.get('/workday', getWorkdays)

export const company = route
