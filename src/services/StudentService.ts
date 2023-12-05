import { Database } from '../data/Db.js'
import { Parent } from '../domain/Parent.js'
import { Student, StudentCreationType, StudentUpdateType } from '../domain/Student.js'
import { ConflictError } from '../domain/errors/Conflict.js'

import { EmptyDependencyError } from '../domain/errors/EmptyDependency.js'
import { Service } from './BaseService.js'
import { ParentService } from './ParentService.js'

export class StudentService extends Service<typeof Student> {
  constructor(repository: Database<typeof Student>, private readonly parentService: ParentService) {
    super(repository)
  }

  update(id: string, newData: StudentUpdateType) {
    const entity = this.findById(id)
    
    const updated = new Student({
      ...entity.toObject(),
      ...newData,
    })

    this.repository.save(updated)
    
    return updated
  }
  
  create(creationData: StudentCreationType) {
    const existing = this.repository.listBy('document', creationData.document)

    if (existing.length > 0) throw new ConflictError(creationData.document, this.repository.dbEntity);
    
    creationData.parents.forEach((parentId) => this.parentService.findById(parentId))
    
    const entity = new Student(creationData)
    this.repository.save(entity)
    
    return entity
  } 

  getParents(studentId: string) {
    const student = this.findById(studentId)
    
    return student.parents.map((parent) => this.parentService.findById(parent))
  }

  linkParents(studentId: string, parentsToUpdate: StudentCreationType['parents']) { 
    const student = this.findById(studentId)
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