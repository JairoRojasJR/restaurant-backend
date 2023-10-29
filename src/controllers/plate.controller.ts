import type { Request, Response } from 'express'
import { type Plate, PlateModel } from '@/models/plate.model'
import type { UpdatePlateBodyType, AddPlateType } from '@/schemas/plates.schema'
import type { TypeMongooseIdType } from '@/schemas'
import { getErrorMessage, getNotFoundDocMsg } from '@/utils'
import { createBlobName, deleteBlob, uploadBlob } from '@/utils/az-blob'
import { type BlobPaths } from '@/types'

const platesPath: BlobPaths = 'plates/'

export const getPlates = async (req: Request, res: Response): Promise<Response> => {
  try {
    const plates = await PlateModel.find()
    return res.json(plates)
  } catch (e) {
    return res.status(400).json({ message: getErrorMessage(e) })
  }
}

export const addPlate = async (
  req: Request<unknown, unknown, AddPlateType>,
  res: Response
): Promise<Response> => {
  try {
    const { name, order } = req.body

    const file = req.file
    if (file === undefined) throw new Error('No se pudo obtener el archivo')

    const blobName = createBlobName(platesPath, file.originalname)

    const plate = new PlateModel({
      name,
      image: blobName,
      order
    })

    const savedPlate = await plate.save()
    await uploadBlob(blobName, file.buffer)

    return res.json(savedPlate)
  } catch (e) {
    return res.status(400).json({ message: getErrorMessage(e) })
  }
}

export const updatePlate = async (
  req: Request<unknown, unknown, UpdatePlateBodyType, TypeMongooseIdType>,
  res: Response
): Promise<Response> => {
  try {
    const { _id } = req.query
    const { file, body } = req
    const { name, order } = body
    const plate: Partial<Plate> = {}

    const currentPlate = await PlateModel.findById(_id)

    if (currentPlate === null) throw new Error(getNotFoundDocMsg(_id))
    if (name !== undefined) plate.name = name
    if (order !== undefined) plate.order = order
    if (file !== undefined) {
      await deleteBlob(currentPlate.image)
      const blobName = createBlobName(platesPath, file.originalname)
      await uploadBlob(blobName, file.buffer)
      plate.image = blobName
    }

    const updatePlate = await PlateModel.findByIdAndUpdate(_id, plate, { new: true })

    return res.json(updatePlate)
  } catch (e) {
    return res.status(400).json({ error: getErrorMessage(e) })
  }
}

export const deletePlate = async (
  req: Request<unknown, unknown, unknown, TypeMongooseIdType>,
  res: Response
): Promise<Response> => {
  try {
    const { _id } = req.query
    const plate = await PlateModel.findById(_id)
    if (plate === null) throw new Error(getNotFoundDocMsg(_id))
    await deleteBlob(plate.image)
    const deletedPlate = await PlateModel.findByIdAndDelete(_id)
    return res.json(deletedPlate)
  } catch (e) {
    return res.status(400).json({ message: getErrorMessage(e) })
  }
}
