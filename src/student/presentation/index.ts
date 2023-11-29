import express from 'express'
import bodyParser from 'body-parser'

import { studentRoutesFactory } from './rest/index'
import { Config } from '../../index'

const app = express()
const PORT = process.env.PORT || 3000

const restLayerStudent = (config: Config) => {
  app.use(bodyParser.json())
  app.use('/student', studentRoutesFactory(config.services))
  app.listen(config.port, () => console.log(`Listening on port ${PORT}`))
}

export { restLayerStudent }