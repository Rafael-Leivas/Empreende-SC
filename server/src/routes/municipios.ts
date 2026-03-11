import { Router } from 'express'
import * as controller from '../controllers/municipios'

const router = Router()

router.get('/', controller.search)

export { router as municipiosRouter }
