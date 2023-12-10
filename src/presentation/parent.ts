import { Router } from 'express'

import { ParentService } from '../services/ParentService.js'
import { StudentService } from '../services/StudentService.js'
import { ParentCreationSchema, ParentUpdateSchema } from '../domain/Parent.js'

import zodValidationMiddleware from './middlewares/zodValidationMiddleware.js'

export function parentRouterFactory(parentService: ParentService, studentService: StudentService){
  const router = Router()

  router.get('/', async (_, res) => { 
    return res.json(parentService.list().map((parent) => parent.toObject()))
  })

  router.get('/:id', async (req, res, next) => { 
    try {
      return res.json(parentService.findById(req.params.id).toObject())
    } catch (error) {
      next(error)
    }
  })

  router.post('/', zodValidationMiddleware(ParentCreationSchema), async (req, res, next) => { 
    try {
      const parent = parentService.create(req.body)

      return res.status(201).json(parent.toObject())
    } catch (error) {
      next(error)
    }
  })

  router.put('/:id', zodValidationMiddleware(ParentUpdateSchema), async (req, res, next) => {
    try {
      const { id } = req.params
      const updated = parentService.update(id, req.body)

      res.set({ Location: `${req.baseUrl}/${updated.id}` })

      return res.json(updated.toJSON())
    } catch (error) {
      next(error)
    }
  })

  router.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params
      const students = studentService.listBy('parents', [id])

      if (students.length > 0) {
        return res.status(403).json({
          message: `Cannot delete parent with id ${id} because it has students assigend`
        })
      }

      parentService.remove(id)

      return res.status(204).send()
    } catch (error) {
      next(error)
    }
  })

  router.get('/:id/students', async (req, res, next) => {
    try {
      const { id } = req.params
      const students = studentService.listBy('parents', [id])

      return res.json(students.map((student) => student.toObject()))
    } catch (error) {
      next(error)
    }
  })

  return router
}