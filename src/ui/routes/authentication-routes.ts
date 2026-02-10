import { signupController } from '@ui/controllers/authentication/signup-controller';
import { Router } from 'express';

const authenticationRouter = Router();

authenticationRouter.post('/signup', signupController);

export default authenticationRouter;
