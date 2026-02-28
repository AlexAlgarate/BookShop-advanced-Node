import { signinController } from '@ui/controllers/authentication/signin-controller';
import { signupController } from '@ui/controllers/authentication/signup-controller';
import { Router } from 'express';

const authenticationRouter: Router = Router();

authenticationRouter.post('/signup', signupController);
authenticationRouter.post('/signin', signinController);

export default authenticationRouter;
