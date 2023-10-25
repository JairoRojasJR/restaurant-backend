import { type Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { Schedule } from '@/models/schedule.model'
import { days } from '@/consts'
import { type Day } from '@/types'

export class Workday {
  @prop({ require: true, enum: days, unique: true })
  public day: Day

  @prop({ ref: () => Schedule, require: true })
  public schedule: Ref<Schedule>
}

export const WorkdayModel = getModelForClass(Workday)
