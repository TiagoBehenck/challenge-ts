import { constants, writeFileSync } from 'node:fs'
import { access, readFile } from 'node:fs/promises'
import * as path from 'node:path'

import { Student, IStudent } from '../../../student/domain/student.entity'

export class Database {
  readonly caminho: string
  #db: Map<Student['id'], Student> = new Map()

  constructor(caminho = './db.json') {
    this.caminho = path.resolve(__dirname, caminho)
  }

  async init () {
    try {
      await access(this.caminho, constants.F_OK)
      await this.#load()
    } catch (error) {
      await this.#updateFile()
    }
  }

  async #load () {
    const readData = await readFile(this.caminho, 'utf8')
    this.#db = new Map(Array.isArray(JSON.parse(readData).authors) ? JSON.parse(readData).authors : new Map())
  }

  #updateFile() {
    writeFileSync(this.caminho, JSON.stringify([...this.#db]))
  }

  upsert(entidade: Student) {
    this.#db.set(entidade.id, entidade)
    this.#updateFile()
  }

  search(id: IStudent['id']) {
    return this.#db.get(id)
  }

  getAll() {
    return Array.from(this.#db.values())
  }

  deleteOne(id: Student['id']) {
    this.#db.delete(id)
    this.#updateFile()
  }
}
