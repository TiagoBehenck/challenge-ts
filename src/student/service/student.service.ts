import { StudentRepository } from '../repository/student.repositoy';

export class StudentService { 
  #studentRepository: StudentRepository

  constructor(studentRepository: StudentRepository) { 
    this.#studentRepository = studentRepository
  }

  async listAll() { 
    return this.#studentRepository.listAll()
  }
}