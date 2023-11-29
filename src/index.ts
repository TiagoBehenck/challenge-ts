import { Database } from './shared/infra/db/Db'
import { start } from './shared/presentation/rest/index'

import { StudentService } from './student/service/student.service'
import { createStudentService } from './student/factories/student.factory'

export interface Config {
  port: number
  services: {
    StudentService: StudentService
  }
}

(async () => {
  const db = new Database
  await db.init()

  const config: Config = {
    port: Number(process.env.PORT) || 3000,
    services: {
      StudentService: createStudentService(db),
    }
  }

  start(config)
})()