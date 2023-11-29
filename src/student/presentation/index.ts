import express from 'express'

import { studentRoutesFactory } from './rest/index'
import { Config } from '../../index'

const app = express()

const restLayerStudent = (config: Config) => {
  
  app.use('/student', studentRoutesFactory(config.services))
}

export { restLayerStudent }