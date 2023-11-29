import { randomUUID } from 'node:crypto'

export enum BloodTypes { 
  'A+',
  'A-',
  'B+',
  'B-',
  'O+',
  'O-',
  'AB+',
  'AB-'
}

export interface IStudent extends Person { 
  dateOfBirth: Date
  parents: string[]
  allergies: string[]
  bloodType: BloodTypes
  medications: string[]
  registrationDate: Date
}

export class Student implements IStudent { 
  readonly id: string
  name: string
  lastName: string
  document: string
  dateOfBirth: Date
  parents: string[]
  allergies: string[]
  bloodType: BloodTypes
  medications: string[]
  registrationDate: Date

  constructor(studentObject: IStudent) {
    this.id = studentObject.id ?? randomUUID()
    this.name = studentObject.name
    this.lastName = studentObject.lastName
    this.document = studentObject.document
    this.dateOfBirth = studentObject.dateOfBirth
    this.parents = studentObject.parents
    this.allergies = studentObject.allergies
    this.bloodType = studentObject.bloodType
    this.medications = studentObject.medications 
    this.registrationDate = studentObject.registrationDate
  }
}