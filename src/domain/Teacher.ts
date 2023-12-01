import { z } from 'zod'
import { randomUUID } from 'crypto'

import { Serializable } from './types.js'

export const TeacherCreationSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string(),
  surname: z.string(),
  phone: z.string(),
  emails: z.string().email(),
  document: z.string(),
  salary: z.number().min(1),
  hiringDate: z.string().datetime().refine((date) => !isNaN(new Date(date).getTime())),
  major: z.string()
})

export type TeacherCreationType = z.infer<typeof TeacherCreationSchema>

export const TeacherUpdateSchema = TeacherCreationSchema.partial().omit({ id: true })

export type TeacherUpdateType = z.infer<typeof TeacherUpdateSchema>

export class Teacher implements Serializable { 
  readonly id: string
  firstName: TeacherCreationType['firstName']
  surname: TeacherCreationType['surname']
  phones: TeacherCreationType['phone'] 
  emails: TeacherCreationType['emails'] 
  document: TeacherCreationType['document'] 
  salary: TeacherCreationType['salary'] 
  hiringDate: Date
  major: TeacherCreationType['major'] 

  constructor(data: TeacherCreationType) { 
    const parsedData = TeacherCreationSchema.parse(data)
    
    this.id = parsedData.id ?? randomUUID()
    this.firstName = parsedData.firstName
    this.surname = parsedData.surname
    this.phones = parsedData.phone
    this.emails = parsedData.emails
    this.document = parsedData.document
    this.salary = parsedData.salary
    this.hiringDate = new Date(parsedData.hiringDate)
    this.major = parsedData.major
  }

  static fromObject(data: Record<string, unknown>) { 
    const parsed = TeacherCreationSchema.parse(data)

    return new Teacher(parsed)
  }

  toObject() { 
    return { 
      id: this.id,
      firstName: this.firstName,
      surname: this.surname,
      phones: this.phones,
      emails: this.emails,
      document: this.document,
      salary: this.salary,
      hiringDate: this.hiringDate.toISOString(),
      major: this.major,
    }
  }

  toJSON() { 
    return JSON.stringify(this.toObject())
  }
}