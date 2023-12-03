import { Parent } from '../domain/Parent.js';
import { Database } from './Db.js';

export class ParentRepository extends Database<Parent> { 
  constructor() { 
    super(Parent)
  }
}