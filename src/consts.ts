import { type Company } from '@/models/company.model'
import { getVariableEnv } from '@/utils'
import type { PlateOrder, Day, ShopStatus, MenuStatus } from '@/types'

export const days: Day[] = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
]

export const platesOrder: PlateOrder[] = ['Entrante', 'Segundo']
export const shopStatus: ShopStatus[] = ['Abierto', 'Cerrado']
export const companyKeys: Array<keyof Company> = ['name', 'address', 'schedules', 'status']
export const menuStates: MenuStatus[] = ['Disponible', 'Agotado']

export const isProdMode = getVariableEnv('MODE') === 'prod'
