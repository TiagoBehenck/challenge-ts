import { z } from 'zod'
import { randomUUID } from 'crypto'

import { AddressSchema, Serializable } from './types.js'

export const ClassCreationSchema = z.object({
  id: z.string().uuid().optional(),
  teacher: z.string().uuid().nullable(),
  code: z.string().regex(/^[0-9]{1}[A-H]{1}-[MTN]$/)
})

export type ClassCreationType = z.infer<typeof ClassCreationSchema>

export const ClassUpdateSchema = ClassCreationSchema.partial().omit({ id: true })

export type ClassUpdateType = z.infer<typeof ClassUpdateSchema>

export class Class implements Serializable { 
  readonly id: string
  code: ClassCreationType['code']
  accessor teacher: ClassCreationType['teacher']

  constructor(data: ClassCreationType) { 
    const parsedData = ClassCreationSchema.parse(data)

    this.id = parsedData.id ?? randomUUID()
    this.code = parsedData.code
    this.teacher = parsedData.teacher
  }

  static fromObject(data: Record<string, unknown>) {
    const parsed = ClassCreationSchema.parse(data)

    return new Class(parsed)
  }

  toObject() {
    return {
      id: this.id,
      code: this.code,
      teacher: this.teacher,
    }
  }

  toJSON() {
    return JSON.stringify(this.toObject())
  }
}