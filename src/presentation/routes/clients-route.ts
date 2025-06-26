import express from 'express';
import { ClientsRepository } from '../../infra/repositories/clients-repository';
import { ClientsController } from '../controllers/clients-controller';
const router = express.Router();

const clientsRepository = new ClientsRepository();

const clientsController = new ClientsController(clientsRepository);

router.get('/clients', clientsController.handler.bind(clientsController));


export default router;
