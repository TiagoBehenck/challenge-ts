import { Config } from '../../../index'
import { restLayerStudent } from '../../../student/presentation/index'

const start = (config: Config) => {
  restLayerStudent(config)
}

export { start }