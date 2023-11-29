import { Router } from 'express'
import { list } from './list'
import { Config } from '../../../index'


export const studentRoutesFactory = (services: Config['services']) => {
  const router = Router()

  router.get('/', list(services.StudentService))
  
  return router
}