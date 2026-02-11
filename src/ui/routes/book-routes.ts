import { Router } from 'express';

import { createProductController } from '@ui/controllers/books/create-product-controller';
import { authenticationMiddleware } from '@ui/middlewares/authentication-middleware';
import { findBooksController } from '@ui/controllers/books/find-books-controller';

const bookRouter = Router();

bookRouter.get('/', findBooksController);
bookRouter.post('/', [authenticationMiddleware], createProductController);

export default bookRouter;
