import { prop, getModelForClass, type Ref } from '@typegoose/typegoose'
import { Workday } from '@/models/workday.model'
import { shopStatus } from '@/consts'
import { type ShopStatus } from '@/types'

const defaultStatus: ShopStatus = 'Cerrado'

export class Status {
  @prop({ required: true, enum: shopStatus, default: defaultStatus })
  public is: ShopStatus

  @prop({ required: true })
  public confirmed: boolean

  @prop({ required: true })
  public confirmedAt: Date
}

export class Company {
  @prop({ required: true })
  public name: string

  @prop({ required: true })
  public address: string

  @prop({ required: true, _id: false })
  public status: Status

  @prop({ ref: () => Workday })
  public schedules: Array<Ref<Workday>>
}

export const CompanyModel = getModelForClass(Company)
