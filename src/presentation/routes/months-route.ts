import express from 'express';

import { InvoicesRepository, MonthsRepository } from '../../infra/repositories';
import { MonthsController } from '../controllers/months-controller';
const router = express.Router();

const monthsRepository = new MonthsRepository();

const clientsController = new MonthsController(monthsRepository);

router.get('/', clientsController.getAll.bind(clientsController));

export default router;
