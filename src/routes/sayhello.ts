import { Router } from 'express'

const route = Router()

route.get('/', (req, res) => {
  return res.send('Hello my friend')
})

export default route
