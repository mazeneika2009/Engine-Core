import { Router } from 'express';
import { handleWebhook } from '../controllers/webhook.js';

const router = Router();

router.get('/:workflowId', handleWebhook);
router.post('/:workflowId', handleWebhook);
router.put('/:workflowId', handleWebhook);
router.delete('/:workflowId', handleWebhook);

export default router;
