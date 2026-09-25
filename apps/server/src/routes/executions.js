import { Router } from 'express';
import * as Executions from '../controllers/executions.js';

const router = Router();

router.get('/', Executions.list);
router.get('/:id', Executions.get);

export default router;
