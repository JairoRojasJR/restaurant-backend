import { type ModelType } from '@typegoose/typegoose/lib/types'

export const getErrorMessage = (error: unknown): string => {
  let message: string
  const thereIsError = error !== undefined && error !== null
  const thereIsMessage = thereIsError && typeof error === 'object' && 'message' in error

  if (error instanceof Error) message = error.message
  else if (thereIsMessage) message = String(error.message)
  else if (typeof error === 'string') message = error
  else message = 'Error desconocido'
  return message
}

export const invalidHourFormatMsg = 'Formato de fecha inválido, se esperaba entre 00:00 - 23:59'

export const validateHourFormat = (toValidate: string): boolean => {
  const dateRegExp = /^([01]\d|2[0-3]):[0-5]\d$/
  return dateRegExp.test(toValidate)
}

export const getNotFoundDocMsg = (_id: string): string => `No encontró el documento con _id: ${_id}`

export const verifyDocExist = async (_id: string, model: ModelType<unknown>): Promise<void> => {
  const exist = await model.findById(_id)
  if (exist === null) throw new Error(`No se encontró el documento con _id: ${_id}`)
}

// Zod get error messages
export const getInvalidTypeError = (expectedType: string): string => {
  return `Tipo inválido, se esperaba un ${expectedType}`
}
export const getRequiredError = (): string => 'Campo requerido'
export const getMinError = (min: number): string => `Requiere un mínimo de ${min} carácteres`
