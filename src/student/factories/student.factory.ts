import { Database } from '../../shared/infra/db/Db'
import { StudentRepository } from '../repository/student.repositoy'
import { StudentService } from '../service/student.service'

export const createStudentService = (db: Database) => {
  const authorRepository = new StudentRepository(db)
  return new StudentService(authorRepository)
}