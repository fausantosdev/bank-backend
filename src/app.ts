import express, { Express } from 'express'
import path from 'path'
import morgan from 'morgan'
import * as rfs from 'rotating-file-stream'

import { globalErrors } from './app/middlewares/globalErrors'

import routes from './app/routes'

import './database'

class App {
    server: Express
    connection: any

    constructor () {
      this.server = express()
      this.middlewares()
      this.routes()

      this.server.set('port', process.env.PORT || 3330)
    }

    middlewares () {
      this.server.use(express.json())

       if(process.env.PRODUCTION)
        {
            let accessLogStream = rfs.createStream('access.log', {
                interval: '1d', // rotate daily
                path: path.join(path.resolve(__dirname, '..'), 'log')
            })

            this.server.use(morgan('combined', { stream: accessLogStream }))
        }
        else
        {
            this.server.use(morgan('dev'))
        }
      this.server.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
    }

    routes () {
      this.server.use(routes)
      this.server.use(globalErrors)// Existiu algum erro?
    }
}

export default new App().server
