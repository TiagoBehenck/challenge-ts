import { Student } from '../domain/student.entity'
import { Database } from '../../shared/infra/db/Db'

export class StudentRepository {
  #DB: Database
  constructor (database: Database) {
    this.#DB = database
  }

  async listAll () {
    const students = await this.#DB.getAll()
    return students.map((student) => new Student(student))
  }
}