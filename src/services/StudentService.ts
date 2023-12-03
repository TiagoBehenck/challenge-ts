import { Database } from '../data/Db.js'
import { Parent } from '../domain/Parent.js'
import { Serializable } from '../domain/types.js'
import { ConflictError } from '../domain/errors/Conflict.js'
import { Student, StudentCreationType, StudentUpdateType } from '../domain/Student.js'

import { ParentService } from './ParentService.js'
import { Service } from './BaseService.js'
import { unknown } from 'zod'
import { EmptyDependencyError } from '../domain/errors/EmptyDependency.js'

export class StudentService extends Service {
  constructor(repository: Database, private readonly parentService: ParentService) {
    super(repository)
  }
  update(id: string, newData: StudentUpdateType): Serializable {
    const entity = this.findById(id) as Student
    
    const updated = new Student({
      ...entity.toObject(),
      ...newData,
    })

    this.repository.save(updated)
    
    return updated
  }
  create(creationData: StudentCreationType): Serializable {
    const existing = this.repository.listBy('document', creationData.document)

    if (existing.length > 0) throw new ConflictError(creationData.document, this.repository.dbEntity);
    
    creationData.parents.forEach((parentId) => this.parentService.findById(parentId))
    
    const entity = new Student(creationData)
    this.repository.save(entity)
    
    return entity
  } 

  getParents(studentId: string) {
    const student = this.findById(studentId) as Student
    
    return student.parents.map((parent) => this.parentService.findById(parent)) as Parent[]
  }

  linkParents(studentId: string, parentsToUpdate: StudentCreationType['parents']) { 
    const student = this.findById(studentId) as Student
    parentsToUpdate.forEach((parent) => this.parentService.findById(parent))

    const newParents = parentsToUpdate.filter((parentId) => !student.parents.includes(parentId))
    this.#assertAtLeastOneParentLeft(newParents)

    student.parents = [...student.parents, ...newParents]

    this.repository.save(student)

    return student
  }

  #assertAtLeastOneParentLeft (parentArray: unknown[]): asserts parentArray is [string, ...string[]] { 
    if(parentArray.length === 0) throw new EmptyDependencyError(Student, Parent)
  }
}