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
