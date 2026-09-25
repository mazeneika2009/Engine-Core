import { Router } from 'express';
import * as Credentials from '../controllers/credentials.js';

const router = Router();

router.get('/', Credentials.list);
router.post('/', Credentials.create);
router.get('/:id', Credentials.get);
router.put('/:id', Credentials.update);
router.delete('/:id', Credentials.remove);

export default router;
