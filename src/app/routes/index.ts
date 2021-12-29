import { Router } from 'express'

import userRoutes from './user.routes'
import authRoutes from './auth.routes'
import pixRoutes from './pix.routes'
const routes = Router()

routes.use('/auth', authRoutes)
routes.use('/user', userRoutes)
routes.use('/pix', pixRoutes)

export default routes