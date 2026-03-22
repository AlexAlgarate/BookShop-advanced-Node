import { signinController } from '@ui/controllers/authentication/signin-controller';
import { signupController } from '@ui/controllers/authentication/signup-controller';
import { siginRateLimit, sigupRateLimit } from '@ui/middlewares/rate-limit-middleware';
import { Router } from 'express';

const authenticationRouter: Router = Router();

authenticationRouter.post('/signup', sigupRateLimit, signupController);
authenticationRouter.post('/signin', siginRateLimit, signinController);

export default authenticationRouter;
