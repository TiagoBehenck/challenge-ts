import { type Request, Router } from 'express'

import { ClassService } from '../services/ClassService.js'
import { ClassCreationSchema, ClassCreationType, ClassUpdateSchema } from '../domain/Class.js'

import zodValidationMiddleware from './middlewares/zodValidationMiddleware.js'

export function classRouterFactory(classService: ClassService) {
  const router = Router()

  router.get('/', async (_, res) => {
    return res.json(classService.list().map((classEntity) => classEntity.toObject()))
  })

  router.get('/:id', async (req, res, next) => {
    try {
      return res.json(classService.findById(req.params.id).toObject())
    } catch (error) {
      next(error)
    }
  })

  router.post('/',
    zodValidationMiddleware(ClassCreationSchema.omit({ id: true })),
    async (req: Request<never, any, Omit<ClassCreationType, 'id'>>, res, next) => {
    try {
      const entity = classService.create(req.body)

      return res.status(201).json(entity.toObject())
    } catch (error) {
      next(error)
    }
  })

  router.put('/:id', zodValidationMiddleware(ClassUpdateSchema), async (req, res, next) => {
    try {
      const { id } = req.params
      const updated = classService.update(id, req.body)

      res.set({ Location: `${req.baseUrl}/${updated.id}` })

      return res.json(updated.toJSON())
    } catch (error) {
      next(error)
    }
  })

  router.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params

      classService.remove(id)

      return res.status(204).send()
    } catch (error) {
      next(error)
    }
  })

  router.get('/:id/students', async (req, res, next) => { 
    try {
      const { id } = req.params
      const students = classService.getStudents(id)

      return res.json(students.map((student) => student.toObject()))
    } catch (error) {
      next(error)
    }
  })

  router.get('/:id/teacher', async (req, res, next) => {
    try {
      const { id } = req.params
      const teacher = classService.getTeacher(id)

      return res.json(teacher.toObject())
    } catch (error) {
      next(error)
    }
  })

  return router
}