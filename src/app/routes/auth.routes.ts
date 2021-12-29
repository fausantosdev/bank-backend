import { Router } from 'express'

import { AuthController } from '../resources/auth/auth.controller'
import { UserController } from '../resources/user/user.controller'

const authController = new AuthController()
const userController = new UserController()
const routes = Router()

routes.post('/signup', userController.store)
routes.post('/signin', authController.store)

export default routes
