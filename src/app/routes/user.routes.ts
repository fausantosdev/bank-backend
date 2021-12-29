import { Router } from 'express'

import userAuthMiddleware from '../middlewares/userAuth'
import { UserController } from '../resources/user/user.controller'

const userController = new UserController()

const routes = Router()

routes.post('/', userController.store)

routes.use(userAuthMiddleware)

routes.get('/me', userController.me)

export default routes
