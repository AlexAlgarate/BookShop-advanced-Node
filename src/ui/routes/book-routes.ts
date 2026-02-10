import { Router } from 'express';

import { createProductController } from '@ui/controllers/books/create-product-controller';

const bookRouter = Router();

bookRouter.post('/books', createProductController);

export default bookRouter;
