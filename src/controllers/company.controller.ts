import type { Request, Response } from 'express'
import { type Model } from 'mongoose'
import { type DocumentType } from '@typegoose/typegoose'
import { type Company, CompanyModel } from '@/models/company.model'
import { type Schedule, ScheduleModel } from '@/models/schedule.model'
import { type Workday, WorkdayModel } from '@/models/workday.model'
import type {
  GetCompanyQueryType,
  AddCompanyType,
  UpdateCompanyType
} from '@/schemas/company.schema'
import { dbClient } from '@/utils/db'
import { getErrorMessage } from '@/utils'

const notFoundDocCompanyMsg = 'No se encontró el documento Company'

const getPopulateds = async (
  output: DocumentType<Company> | null
): Promise<DocumentType<Company>> => {
  if (output === null) throw new Error(notFoundDocCompanyMsg)
  const schedules = await output.populate('schedules', '-_id')
  const schedule = await schedules.populate('schedules.schedule', 'name -_id')
  return schedule
}

export const getCompany = async (
  req: Request<unknown, unknown, unknown, GetCompanyQueryType>,
  res: Response
): Promise<Response> => {
  const { query } = req.query

  try {
    const companies = await CompanyModel.find()
    let company = companies[0]
    company = await getPopulateds(company)

    if (companies.length === 0) throw new Error(notFoundDocCompanyMsg)
    if (companies.length > 1) throw new Error('Se encontró más de un registro de company')

    if (query !== undefined && Object.values(query).length > 0) {
      const companyQuery = company.get(query)
      return res.json(companyQuery)
    } else return res.json(company)
  } catch (e) {
    return res.status(400).json({ error: getErrorMessage(e) })
  }
}

export const addCompany = async (
  req: Request<unknown, unknown, AddCompanyType>,
  res: Response
): Promise<Response> => {
  const { name, address, schedules, workdays, status } = req.body

  const savedSchedules: Array<DocumentType<Schedule>> = []

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const dropCollection = async (model: Model<any>): Promise<void> => {
    try {
      const collectionName = model.collection.name
      const client = await dbClient
      await client.db().collection(collectionName).drop()
    } catch (error) {
      console.error(error)
    }
  }

  for (const schedule of schedules) {
    try {
      const scheduledb = new ScheduleModel(schedule)
      const savedSchedule = await scheduledb.save()
      savedSchedules.push(savedSchedule)
    } catch (e) {
      await dropCollection(ScheduleModel)
      return res.status(400).json({ error: getErrorMessage(e) })
    }
  }

  const cacheScheduleExist: Record<string, DocumentType<Schedule>> = {}
  const savedWorkdays: Array<DocumentType<Workday>> = []

  const getSchedule = (schedule: string): DocumentType<Schedule> => {
    const inCache = cacheScheduleExist[schedule]
    if (inCache !== undefined) return inCache

    const savedSchedule = savedSchedules.find((curretSchedule) => {
      return curretSchedule.name === schedule
    })

    if (savedSchedule === undefined) throw new Error(`No se encontró el horario ${schedule}`)
    else {
      cacheScheduleExist[schedule] = savedSchedule
      return cacheScheduleExist[schedule]
    }
  }

  for (const workday of workdays) {
    const { day, schedule } = workday

    try {
      const savedSchedule = getSchedule(schedule)
      const workdaydb = new WorkdayModel({ day, schedule: savedSchedule._id })
      const savedWorday = await workdaydb.save()
      savedWorkdays.push(savedWorday)
    } catch (e) {
      await dropCollection(ScheduleModel)
      await dropCollection(WorkdayModel)
      return res.status(400).json({ error: getErrorMessage(e) })
    }
  }

  try {
    const company = new CompanyModel({
      name,
      address,
      schedules: savedWorkdays.map((workday) => workday._id),
      status: { is: status, confirmed: true, confirmedAt: new Date() }
    })

    let savedCompany = await company.save()
    savedCompany = await savedCompany.populate('schedules', '-_id')
    savedCompany = await savedCompany.populate('schedules.schedule', 'name -_id')

    return res.json(savedCompany)
  } catch (e) {
    await dropCollection(ScheduleModel)
    await dropCollection(WorkdayModel)
    await dropCollection(CompanyModel)
    return res.status(400).json({ error: getErrorMessage(e) })
  }
}

export const getSchedules = async (req: Request, res: Response): Promise<Response> => {
  try {
    const schedules = await ScheduleModel.find()
    return res.json(schedules)
  } catch (e) {
    return res.status(400).send({ error: getErrorMessage(e) })
  }
}

export const getWorkdays = async (req: Request, res: Response): Promise<Response> => {
  try {
    const workdays = await WorkdayModel.find().populate('schedule', 'name -_id')
    return res.json(workdays)
  } catch (e) {
    return res.status(400).json({ error: getErrorMessage(e) })
  }
}

export const updateCompany = async (
  req: Request<unknown, unknown, UpdateCompanyType>,
  res: Response
): Promise<Response> => {
  try {
    const companies = await CompanyModel.find()
    const currentCompany = companies[0]
    const company: Partial<Company> = {}

    const { name, address, status } = req.body

    if (name !== undefined) company.name = name
    if (address !== undefined) company.address = address
    if (status !== undefined) {
      company.status = { is: status, confirmed: true, confirmedAt: new Date() }
    }

    let updatedCompany = await CompanyModel.findByIdAndUpdate(currentCompany._id, company, {
      new: true
    })
    updatedCompany = await getPopulateds(updatedCompany)
    return res.json(updatedCompany)
  } catch (e) {
    return res.status(400).json({ error: getErrorMessage(e) })
  }
}
