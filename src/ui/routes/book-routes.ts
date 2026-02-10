import { Router } from 'express';

import { createProductController } from '@ui/controllers/books/create-product-controller';
import { authenticationMiddleware } from '@ui/middlewares/authentication-middleware';

const bookRouter = Router();

bookRouter.post('/', [authenticationMiddleware], createProductController);

export default bookRouter;
