import * as dotenv from 'dotenv'
dotenv.config()

import 'reflect-metadata'

import app from './app'

const PORT = app.get('port')

app.listen(PORT, () => {
  console.log(`~ app running on port ${PORT}...`)
}) 

// //import { resolve } from 'path'{path: resolve(__dirname, '..', '.env')}

