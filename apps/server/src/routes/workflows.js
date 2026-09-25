import { Router } from 'express';
import * as Workflows from '../controllers/workflows.js';

const router = Router();

router.get('/', Workflows.list);
router.post('/', Workflows.create);
router.get('/:id', Workflows.get);
router.put('/:id', Workflows.update);
router.delete('/:id', Workflows.remove);
router.post('/:id/execute', Workflows.execute);

export default router;
