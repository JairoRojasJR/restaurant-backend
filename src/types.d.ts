export type PlateOrder = 'Entrante' | 'Segundo'
export type Day = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo'
export type ShopStatus = 'Abierto' | 'Cerrado'
export type MenuStatus = 'Disponible' | 'Agotado'

export type BlobPaths = 'plates/'

export interface ResponseMessage {
  message: string
}

export interface ResponseError {
  error: string
}

export interface ResponseSchemaError {
  name: string
  errors: ResponseSchemaErrorErrors[]
}

interface ResponseSchemaErrorErrors extends ResponseMessage {
  path: Array<string | number>
}

export type ResponseMessageOrError = ResponseMessage & ResponseError

export interface SessionCookie {
  originalMaxAge: number
  expires: string | Date
  secure: boolean
  httpOnly: boolean
  path: string
  sameSite: boolean | 'lax' | 'strict' | 'none'
}
