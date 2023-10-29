import { Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { Plate } from '@/models/plate.model'
import { menuStates } from '@/consts'
import { type MenuStatus } from '@/types'

export class Menu {
  @prop({ ref: () => Plate, required: true, unique: true })
  plate: Ref<Plate>

  @prop({ required: true, enum: menuStates })
  status: MenuStatus
}

export const MenuModel = getModelForClass(Menu)
