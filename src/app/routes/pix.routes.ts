import { Router } from 'express'

import userAuthMiddleware from '../middlewares/userAuth'
import { PixController } from '../resources/pix/pix.controller'

const pixController = new PixController()

const routes = Router()

routes.use(userAuthMiddleware)

routes.post('/request', pixController.request)
routes.post('/pay/:key', pixController.pay)
routes.get('/tranzactions', pixController.transactions)

export default routes
