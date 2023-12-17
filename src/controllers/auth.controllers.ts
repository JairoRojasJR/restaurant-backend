import type { Request, Response } from 'express'
import type { StatusSchemaType, LoginSchemaType } from '@/schemas/auth.schema'
import { getErrorMessage, getVariableEnv } from '@/utils'
import { isProdMode } from '@/consts'
import { type SessionCookie } from '@/types'

export const status = async (
  req: Request<unknown, unknown, unknown, StatusSchemaType>,
  res: Response
): Promise<Response> => {
  const sessionId = req.query?.sessionId

  if (sessionId !== undefined) {
    const checkAuthenticated = async (): Promise<boolean> => {
      return await new Promise<boolean>((resolve, reject) => {
        req.sessionStore.get(sessionId, (error, session) => {
          const notError = error === null || error === undefined
          const thereSession = session !== null && session !== undefined
          if (notError) resolve(thereSession)
          reject(getErrorMessage(error))
        })
      })
    }

    try {
      const isAuthenticated = await checkAuthenticated()
      return res.status(200).json({ authenticated: isAuthenticated })
    } catch (error) {
      return res.status(400).json({ error: getErrorMessage(error) })
    }
  } else {
    return res.status(200).json({ authenticated: req.isAuthenticated() })
  }
}

export const login = async (
  req: Request<unknown, unknown, LoginSchemaType>,
  res: Response
): Promise<Response> => {
  if (req.isAuthenticated()) {
    return res.status(409).json({ error: 'Usuario ya autenticado' })
  }
  const { username, password } = req.body
  const recoveredUsername = getVariableEnv('ADMIN_USER')
  const recoveredPassword = getVariableEnv('ADMIN_PASS')
  const usernameMatch = username === recoveredUsername
  const passwordMatch = password === recoveredPassword

  if (usernameMatch && passwordMatch) {
    const runLogin = async (): Promise<string> => {
      return await new Promise<string>((resolve, reject) => {
        req.login(username, function (error) {
          if (error === null || error === undefined) resolve(req.sessionID)
          reject(getErrorMessage(error))
        })
      })
    }

    const getCookie = async (): Promise<SessionCookie> => {
      return await new Promise<SessionCookie>((resolve, reject) => {
        req.sessionStore.get(req.sessionID, (error, session) => {
          const notError = error === null || error === undefined
          const thereSession = session !== null && session !== undefined

          if (notError && thereSession) {
            const { originalMaxAge, expires, secure, httpOnly, path, sameSite } = session.cookie

            resolve({
              originalMaxAge: originalMaxAge ?? 0,
              expires: expires ?? '',
              secure: secure === 'auto' || secure === undefined ? isProdMode : secure,
              httpOnly: httpOnly ?? true,
              path: path ?? '/',
              sameSite: sameSite ?? (isProdMode ? 'strict' : 'lax')
            })
          }

          reject(getErrorMessage(error))
        })
      })
    }

    try {
      const sessionId = await runLogin()
      const cookie = await getCookie()
      const session = { id: sessionId, cookie }
      return res.status(200).json({ message: 'Sesión iniciada correctamente', session })
    } catch (error) {
      return res.status(400).json({ error: 'Surgió un error al iniciar sesión' })
    }
  } else return res.status(400).json({ error: 'Usuario o contraseña no coincide' })
}

export const logout = async (req: Request, res: Response): Promise<Response> => {
  const runLogout = async (): Promise<string | null> => {
    return await new Promise((resolve, reject) => {
      req.logout(function (error) {
        if (error === null || error === undefined) resolve(null)
        reject(getErrorMessage(error))
      })
    })
  }

  const runSessionDestroy = async (): Promise<string | null> => {
    return await new Promise((resolve, reject) => {
      req.session.destroy(function (error) {
        if (error === null || error === undefined) resolve(null)
        reject(getErrorMessage(error))
      })
    })
  }

  try {
    await runLogout()
    await runSessionDestroy()
    return res.status(200).json({ message: 'Sesión cerrada exitosamente' })
  } catch (error) {
    return res.status(200).json({ error: getErrorMessage(error) })
  }
}
