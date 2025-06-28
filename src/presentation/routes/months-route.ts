import express from 'express';

import { ClientsRepository, InvoicesRepository, MonthsRepository } from '../../infra/repositories';
import { MonthsController } from '../controllers';
const router = express.Router();

const monthsRepository = new MonthsRepository();
const invoicesRepository = new InvoicesRepository();
const clientsRepository = new ClientsRepository();

const monthsController = new MonthsController(monthsRepository,invoicesRepository,clientsRepository);

router.get('/', monthsController.getAll.bind(monthsController));
router.get('/:id/invoices', monthsController.getInvoices.bind(monthsController));
router.get('/clients-anniversary', monthsController.getClientsAnniversary.bind(monthsController));

export { router as monthsRoute }
