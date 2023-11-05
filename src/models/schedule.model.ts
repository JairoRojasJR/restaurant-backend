import { getModelForClass, prop, pre } from '@typegoose/typegoose'
import { invalidHourFormatMsg, validateHourFormat } from '@/utils'

@pre<Schedule>('save', function (next) {
  const validOpening = validateHourFormat(this.opening)
  const validClosing = validateHourFormat(this.closing)
  if (!validOpening || !validClosing) {
    next(new Error(invalidHourFormatMsg))
  }
  next()
})
export class Schedule {
  @prop({ required: true })
  public name: string

  @prop({ required: true })
  public opening: string

  @prop({ required: true })
  public closing: string
}

export const ScheduleModel = getModelForClass(Schedule)
