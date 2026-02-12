import { Router } from 'express';

import { findUserBooksController } from '@ui/controllers/books/find-user-books-controller';
import { authenticationMiddleware } from '@ui/middlewares/authentication-middleware';

const userBookRouter = Router();

userBookRouter.get('/books', [authenticationMiddleware], findUserBooksController);

export default userBookRouter;
