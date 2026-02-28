import { Router } from 'express';

import { createBookController } from '@ui/controllers/books/create-book-controller';
import { authenticationMiddleware } from '@ui/middlewares/authentication-middleware';
import { findBooksController } from '@ui/controllers/books/find-books-controller';
import { updateBookController } from '@ui/controllers/books/update-book-controller';
import { buyBookController } from '@ui/controllers/books/buy-book-controller';
import { deleteBookController } from '@ui/controllers/books/delete-book-controller';

const bookRouter: Router = Router();

bookRouter.get('/', findBooksController);
bookRouter.post('/', [authenticationMiddleware], createBookController);
bookRouter.patch('/:bookId', [authenticationMiddleware], updateBookController);
bookRouter.post('/:bookId/buy', [authenticationMiddleware], buyBookController);
bookRouter.delete('/:bookId', [authenticationMiddleware], deleteBookController);

export default bookRouter;
