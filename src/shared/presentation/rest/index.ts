import express from 'express'
import bodyParser from 'body-parser'

import { Config } from '../../../index'
import { restLayerStudent } from '../../../student/presentation/index'

const app = express()
const PORT = process.env.PORT || 3000

const start = (config: Config) => {
  app.use(bodyParser.json())
  
  restLayerStudent(config)

  app.listen(config.port, () => console.log(`Listening on port ${PORT}`))
}

export { start }