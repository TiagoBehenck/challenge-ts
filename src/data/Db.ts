import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

import { Serializable, SerializableStatic } from '../domain/types.js'

export abstract class Database<Domain extends Serializable> { 
  protected readonly dbPath: string
  protected dbData: Map<string, Domain> = new Map()
  readonly dbEntity: SerializableStatic

  constructor(entity: SerializableStatic) { 
    this.dbEntity = entity
    const filePath = fileURLToPath(import.meta.url)
    this.dbPath = resolve(dirname(filePath), `.data/${entity.name.toLocaleLowerCase()}.json`)

    this.#initialize()
  }

  #initialize() { 
    if(!existsSync(dirname(this.dbPath))) { 
      mkdirSync(dirname(this.dbPath), { recursive: true })
    }

    if(existsSync(this.dbPath)) { 
      const data: [string, Record<string, unknown>][] = JSON.parse(readFileSync(this.dbPath, 'utf-8'))
      
      for(const [key, value] of data) { 
        this.dbData.set(key, this.dbEntity.fromObject(value))
      }

      return
    }

    this.#updateFile()
  }

  #updateFile() { 
    const data = [...this.dbData.entries()].map(([key, value]) => [key, value.toObject()])

    writeFileSync(this.dbPath, JSON.stringify(data))

    return this
  }

  list(): Domain[] { 
    return [...this.dbData.values()]
  }

  remove(id: string) { 
    this.dbData.delete(id)

    return this.#updateFile()
  }

  save(entity: Domain) { 
    this.dbData.set(entity.id, entity)

    return this.#updateFile()
  }

  listBy(property: string, value: any) { 
    const allData = this.list()

    return allData.filter((data) => { 
      let comparable = (data as any)[property] as unknown
      let comparison = value as unknown

      if(typeof comparable === 'object') { 
        [comparable, comparison] = [JSON.stringify(comparable), JSON.stringify(comparison)]
      }

      return comparable === comparison
    })
  }

  findById(id: string) {
    return this.dbData.get(id)
  }
}