import { Request, Response } from 'express'
import { StudentService } from '../../service/student.service'

export const list = (StudentService: StudentService) => async (_: Request, res: Response) => {
  const students = await StudentService.listAll()
  res.status(200).json(students)
}