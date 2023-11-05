import { MenuModel } from '@/models/menu.model'
import { type TypeMongooseIdInQueryType } from '@/schemas'
import type {
  AddPlateToMenuBodyType,
  UpdatePlateFromMenuBodyType,
  UpdatePlateFromMenuQueryType
} from '@/schemas/menu.schema'
import { getErrorMessage, verifyDocExist } from '@/utils'
import type { Request, Response } from 'express'

export const getMenu = async (req: Request, res: Response): Promise<Response> => {
  try {
    const menu = await MenuModel.find().populate('plate')
    return res.json(menu)
  } catch (error) {
    return res.json({ error: getErrorMessage(error) })
  }
}

export const addPlateToMenu = async (
  req: Request<unknown, unknown, AddPlateToMenuBodyType>,
  res: Response
): Promise<Response> => {
  try {
    const menuPlate = new MenuModel(req.body)
    const savedMenuPlate = await menuPlate.save()
    const populated = await savedMenuPlate.populate('plate')
    return res.json(populated)
  } catch (error) {
    return res.status(400).json({ error: getErrorMessage(error) })
  }
}

export const updatePlateFromMenu = async (
  req: Request<unknown, unknown, UpdatePlateFromMenuBodyType, UpdatePlateFromMenuQueryType>,
  res: Response
): Promise<Response> => {
  const { _id } = req.query
  try {
    await verifyDocExist(_id, MenuModel)
    const updatedPlateFromMenu = await MenuModel.findByIdAndUpdate(_id, req.body, {
      new: true
    }).populate('plate')
    return res.json(updatedPlateFromMenu)
  } catch (error) {
    return res.status(400).json({ error: getErrorMessage(error) })
  }
}

export const removePlateToMenu = async (
  req: Request<unknown, unknown, unknown, TypeMongooseIdInQueryType>,
  res: Response
): Promise<Response> => {
  try {
    const { _id } = req.query
    await verifyDocExist(_id, MenuModel)
    const plateDeletedFromMenu = await MenuModel.findByIdAndDelete(_id).populate('plate')
    return res.json(plateDeletedFromMenu)
  } catch (error) {
    return res.status(400).json({ error: getErrorMessage(error) })
  }
}
