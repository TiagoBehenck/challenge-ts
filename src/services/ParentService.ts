import { Parent, ParentCreationType, ParentUpdateType } from '../domain/Parent.js'
import { ConflictError } from '../domain/errors/Conflict.js'
import { Service } from './BaseService.js'

export class ParentService extends Service { 
  update(id: string, newData: ParentUpdateType) { 
    const entity = this.findById(id) as Parent
    
    const updated = new Parent({
      ...entity.toObject(),
      ...newData,
    })

    this.repository.save(updated)
    
    return updated
  }

  create(creationData: ParentCreationType) { 
    const existing = this.repository.listBy('document', creationData.document)

    if (existing.length > 0) throw new ConflictError(creationData.document, this.repository.dbEntity);
    
    const entity = new Parent(creationData)

    this.repository.save(entity)

    return entity
  }
}