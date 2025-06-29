import express from 'express';
import { ClientsRepository } from '../../infra/repositories/clients-repository';
import { ClientsController } from '../controllers';
import { InvoicesRepository } from '../../infra/repositories';
const router = express.Router();

const clientsRepository = new ClientsRepository();
const invoicesRepository = new InvoicesRepository()

const clientsController = new ClientsController(clientsRepository,invoicesRepository);

router.get('/' ,clientsController.getAll.bind(clientsController));
router.post('/', clientsController.create.bind(clientsController));
router.put('/:id', clientsController.update.bind(clientsController));
router.get('/:id', clientsController.findById.bind(clientsController));
router.delete('/:id', clientsController.delete.bind(clientsController));
router.get('/:id/invoices', clientsController.getInvoices.bind(clientsController));


export { router as clientsRoute }
