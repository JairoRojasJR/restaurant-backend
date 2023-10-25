import type { Request, Response } from 'express'
import { type Model } from 'mongoose'
import { type DocumentType } from '@typegoose/typegoose'
import { type Company, CompanyModel } from '@/models/company.model'
import { type Schedule, ScheduleModel } from '@/models/schedule.model'
import { type Workday, WorkdayModel } from '@/models/workday.model'
import type { GetCompanyQueryType, AddCompanyType } from '@/schemas/company.schema'
import connection from '@/utils/db'
import { getErrorMessage } from '@/utils'

export const addCompany = async (
  req: Request<unknown, unknown, AddCompanyType>,
  res: Response
): Promise<Response> => {
  const { name, address, schedules, workdays, status } = req.body

  const savedSchedules: Array<DocumentType<Schedule>> = []

  const dropCollection = async (model: Model<any>): Promise<void> => {
    try {
      const collectionName = model.collection.name
      await connection.db.collection(collectionName).drop()
    } catch (error) {
      console.error(error)
    }
  }

  for (const schedule of schedules) {
    try {
      const scheduledb = new ScheduleModel(schedule)
      const savedSchedule = await scheduledb.save()
      savedSchedules.push(savedSchedule)
    } catch (error) {
      console.error(error)
      await dropCollection(ScheduleModel)
      return res.status(400).json({ message: 'Surgió un error al agregar schedules' })
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
    } catch (error) {
      await dropCollection(ScheduleModel)
      await dropCollection(WorkdayModel)
      return res.status(400).json({ message: 'Surgió un error al agregar workdays' })
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
  } catch (error) {
    console.error(error)
    await dropCollection(ScheduleModel)
    await dropCollection(WorkdayModel)
    await dropCollection(CompanyModel)
    return res.json({ message: 'Surgió un error al agregar company' })
  }
}

export const getCompany = async (
  req: Request<unknown, unknown, unknown, GetCompanyQueryType>,
  res: Response
): Promise<Response> => {
  const { query } = req.query
  const notFoundDocCompanyMsg = 'No se encontró el documento Company'

  const getPopulateds = async (company: DocumentType<Company>): Promise<DocumentType<Company>> => {
    const schedules = await company.populate('schedules', '-_id')
    return await schedules.populate('schedules.schedule', 'name -_id')
  }

  try {
    if (query !== undefined) {
      let company = await CompanyModel.findOne({}, `${query} -_id`)
      if (company === null) throw new Error(notFoundDocCompanyMsg)
      if (query === 'schedules') company = await getPopulateds(company)
      return res.json(company)
    } else {
      let company = await CompanyModel.findOne()
      if (company === null) throw new Error(notFoundDocCompanyMsg)
      company = await getPopulateds(company)
      return res.json(company)
    }
  } catch (error) {
    return res.json({ message: getErrorMessage(error) })
  }
}

export const getSchedules = async (req: Request, res: Response): Promise<Response> => {
  try {
    const schedules = await ScheduleModel.find()
    return res.json(schedules)
  } catch (e) {
    return res.status(400).send({ message: getErrorMessage(e) })
  }
}

export const getWorkdays = async (req: Request, res: Response): Promise<Response> => {
  try {
    const workdays = await WorkdayModel.find().populate('schedule', 'name -_id')
    return res.json(workdays)
  } catch (e) {
    return res.json({ error: getErrorMessage(e) })
  }
}
