import express from 'express';

import { ClientsRepository, InvoicesRepository, MonthsRepository } from '../../infra/repositories';
import { AutomationsController } from '../controllers';
const router = express.Router();

const monthsRepository = new MonthsRepository();
const invoicesRepository = new InvoicesRepository();
const clientsRepository = new ClientsRepository();

const monthsController = new AutomationsController(clientsRepository,invoicesRepository,monthsRepository);

router.post('/create-invoices', monthsController.createInvoice.bind(monthsController));

export { router as automationRoute };
