import express from 'express';
import { UsersController } from '../controllers';
import Authenticator from '../../infra/authentication/authenticator';

const router = express.Router();


const authenticator = new Authenticator();
const usersController = new UsersController(authenticator);

router.post('/login', usersController.login.bind(usersController));

export { router as usersRoute }
