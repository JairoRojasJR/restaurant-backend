import type { Request, Response } from 'express'
import { getErrorMessage } from '@/utils'
import { azConnection } from '@/utils/az-blob'
const containerClient = azConnection()

export const stream = async (req: Request, res: Response): Promise<Response | undefined> => {
  const path = req.params[0]
  const params = path.split('/')
  const src = params[params.length - 1].split('.')
  const contentType = `image/${src[1] === 'jpg' ? 'jpeg' : src[1]}`

  res.header('content-type', contentType)
  res.set('accet-ranges', 'bytes')

  try {
    if (containerClient === undefined) throw new Error('No se encontró el cliente contenedor')
    const blockBlobClient = containerClient.getBlockBlobClient(path)

    const downloadBlockBlobResponse = await blockBlobClient.download(0)
    const readableStream = downloadBlockBlobResponse.readableStreamBody

    if (readableStream === undefined) throw new Error('No se encontró el cliente contenedor')

    readableStream.on('data', (chunk) => res.write(chunk))
    readableStream.on('end', () => res.end())
    readableStream.on('error', (error) => {
      console.log('Hubo un error en stream')
      res.status(400).json({ message: getErrorMessage(error) })
    })
  } catch (error) {
    res.header('content-type', 'application/json')
    return res.status(400).json({ message: getErrorMessage(error) })
  }
}
