import express from 'express';
import { InvoicesRepository } from '../../infra/repositories';
import { InvoicesController } from '../controllers';
const router = express.Router();

const invoicesRepository = new InvoicesRepository()
const invoicesController = new InvoicesController(invoicesRepository);

router.get('/pending', invoicesController.findPendingInvoices.bind(invoicesController));
router.put('/:id', invoicesController.update.bind(invoicesController));

export { router as invoicesRoute }
