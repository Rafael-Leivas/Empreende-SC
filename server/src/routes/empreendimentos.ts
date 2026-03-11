import { Router } from 'express'
import * as controller from '../controllers/empreendimentos'

const router = Router()

router.get('/stats', controller.stats)  // BEFORE /:id
router.get('/', controller.list)
router.get('/:id', controller.getById)
router.post('/', controller.create)
router.put('/:id', controller.update)
router.delete('/:id', controller.remove)

export { router as empreendimentosRouter }
