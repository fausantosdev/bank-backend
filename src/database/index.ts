import { createConnection, Connection } from 'typeorm'
import ormConfigs from '../../ormconfig.json'


class Database {
  connection: any
  auth: any

  constructor () {
    this.auth = ormConfigs
    this.init()
  }

  async init () {
    try {
      this.connection = await createConnection(this.auth)

      console.log('~ connection has been established successfully.')
    } catch (error) {
      console.error(error)
    }
  }
}

export default new Database()
