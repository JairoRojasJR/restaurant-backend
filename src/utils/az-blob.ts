import { BlobServiceClient, type ContainerClient } from '@azure/storage-blob'
import { v4 as uuidv4 } from 'uuid'
import { getErrorMessage } from '.'

let containerClient: ContainerClient

export const azConnection = (): ContainerClient | undefined => {
  if (containerClient !== undefined) return containerClient
  const connectionString = process.env.AZ_CONNECTION_STRING
  const blobContainer = process.env.AZ_BLOB_CONTAINER

  try {
    if (connectionString === undefined) throw new Error('Falta la cadena de conexión')
    if (blobContainer === undefined) throw new Error('Falta el nombre del contenedor')

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
    containerClient = blobServiceClient.getContainerClient(`${blobContainer}/images`)
    return containerClient
  } catch (e) {
    console.error(getErrorMessage(e))
  }
}

export const createBlobName = (path: string, fullFileName: string): string => {
  const fileNameSplit = fullFileName.split('.')

  const fileName = fileNameSplit[0]
  const blobNameId = '--id--' + uuidv4()
  const fileExtension = fileNameSplit[1]

  return `${path}${fileName}${blobNameId}.${fileExtension}`
}

export const uploadBlob = async (blobName: string, buffer: Buffer): Promise<void> => {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)
  await blockBlobClient.upload(buffer, buffer.length)
}

export const deleteBlob = async (blobName: string): Promise<void> => {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)
  await blockBlobClient.delete({ deleteSnapshots: 'include' })
}
