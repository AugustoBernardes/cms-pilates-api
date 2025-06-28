import express from 'express';

import { InvoicesRepository, MonthsRepository } from '../../infra/repositories';
import { MonthsController } from '../controllers/months-controller';
const router = express.Router();

const monthsRepository = new MonthsRepository();
const invoicesRepository = new InvoicesRepository();

const monthsController = new MonthsController(monthsRepository,invoicesRepository);

router.get('/', monthsController.getAll.bind(monthsController));
router.get('/:id/invoices', monthsController.getInvoices.bind(monthsController));

export default router;
