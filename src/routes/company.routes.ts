import { addCompany, getCompany, getSchedules, getWorkdays } from '@/controllers/company.controller'
import { validatorSchema } from '@/middleware/validator-schema.middleware'
import { AddCompanySchema, GetCompanySchema } from '@/schemas/company.schema'
import { Router } from 'express'

const route = Router()

route.get('/', validatorSchema(GetCompanySchema), getCompany)
route.post('/', validatorSchema(AddCompanySchema), addCompany)
route.get('/schedule', getSchedules)
route.get('/workday', getWorkdays)

export const company = route
