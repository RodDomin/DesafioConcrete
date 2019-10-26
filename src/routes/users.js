import { Router } from 'express'
import jwtMiddleware from '../App/middleware/token'
import UserController from '../App/controllers/UserController'
import SessionControlller from '../App/controllers/SessionController'

const routes = Router()

routes.post('/', UserController.store)

routes.post('/login', SessionControlller.create)

routes.use(jwtMiddleware)

routes.get('/:id', UserController.index)

export default routes
