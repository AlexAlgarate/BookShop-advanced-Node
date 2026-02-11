import { Router } from 'express';

import { createBookController } from '@ui/controllers/books/create-book-controller';
import { authenticationMiddleware } from '@ui/middlewares/authentication-middleware';
import { findBooksController } from '@ui/controllers/books/find-books-controller';

const bookRouter = Router();

bookRouter.get('/', findBooksController);
bookRouter.post('/', [authenticationMiddleware], createBookController);

export default bookRouter;
