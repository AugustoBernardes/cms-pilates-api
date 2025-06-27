import express from 'express';
import { ClientsRepository } from '../../infra/repositories/clients-repository';
import { ClientsController } from '../controllers/clients-controller';
import { InvoicesRepository } from '../../infra/repositories/invoices-repository';
const router = express.Router();

const clientsRepository = new ClientsRepository();
const invoicesRepository = new InvoicesRepository()

const clientsController = new ClientsController(clientsRepository,invoicesRepository);

router.get('/', clientsController.getAll.bind(clientsController));
router.get('/:id/invoices', clientsController.getInvoices.bind(clientsController));


export default router;
