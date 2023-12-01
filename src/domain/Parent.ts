import { z } from 'zod'
import { randomUUID } from 'crypto'

import { AddressSchema, Serializable } from './types.js'

export const ParentCreationSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string(),
  surname: z.string(),
  phones: z.array(z.string()).nonempty(),
  emails: z.string().email().array().nonempty(),
  address: z.array(AddressSchema).nonempty(),
  document: z.string(),
})

export type ParentCreationType = z.infer<typeof ParentCreationSchema>

export const ParentUpdateSchema = ParentCreationSchema.partial().omit({ id: true })

export type ParentUpdateType = z.infer<typeof ParentUpdateSchema>

export class Parent implements Serializable { 
  readonly id: string
  firstName: ParentCreationType['firstName']
  surname: ParentCreationType['surname']
  phones: ParentCreationType['phones'] 
  emails: ParentCreationType['emails'] 
  address: ParentCreationType['address']
  document: ParentCreationType['document'] 

  constructor(data: ParentCreationType) { 
    const parsedData = ParentCreationSchema.parse(data)

    this.id = parsedData.id ?? randomUUID()
    this.firstName = parsedData.firstName
    this.surname = parsedData.surname
    this.phones = parsedData.phones
    this.emails = parsedData.emails
    this.address = parsedData.address
    this.document = parsedData.document
  }

  static fromObject(data: Record<string, unknown>) { 
    const parsed = ParentCreationSchema.parse(data)

    return new Parent(parsed)
  }

  toObject() { 
    return { 
      firstName: this.firstName,
      surname: this.surname,
      phones: this.phones,
      emails: this.emails,
      address: this.address,
      document: this.document,
      id: this.id
    }
  }

  toJSON() { 
    return JSON.stringify(this.toObject())
  }
}