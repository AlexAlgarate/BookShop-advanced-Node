import 'reflect-metadata';
import { injectable, inject } from 'inversify';

import { Book } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { UserRepository } from '@domain/repositories/UserRepository';
import { EmailService } from '@domain/services/EmailService';
import { NotificationTemplateService } from '@domain/services/NotificationTemplateService';
import { LoggerService } from '@domain/services/LoggerService';
import { EmailServiceError, EntityNotFoundError } from '@domain/types/errors';
import { BuyBookQuery } from '@domain/types/book/BuyBookQuery';
import {
  BOOK_REPOSITORY,
  USER_REPOSITORY,
  EMAIL_SERVICE,
  NOTIFICATION_TEMPLATE_SERVICE,
  LOGGER_SERVICE,
} from '@di/tokens';

@injectable()
export class BuyBookUseCase {
  constructor(
    @inject(BOOK_REPOSITORY) private readonly bookRepository: BookRepository,
    @inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @inject(EMAIL_SERVICE) private readonly emailService: EmailService,
    @inject(NOTIFICATION_TEMPLATE_SERVICE)
    private readonly templateService: NotificationTemplateService,
    @inject(LOGGER_SERVICE) private readonly loggerService: LoggerService
  ) {}

  public async execute({ bookId, buyerId }: BuyBookQuery): Promise<Book | null> {
    const book = await this.bookRepository.findById(bookId);
    if (!book) throw new EntityNotFoundError('Book', bookId);

    const sellerId = book.ownerId;
    const soldBook = book.sellTo(buyerId);

    const updatedBook = await this.bookRepository.updateBookDetails(soldBook);
    await this.notifyToSeller(sellerId, book.title, book.price);

    return updatedBook;
  }

  private async notifyToSeller(
    sellerId: string,
    bookTitle: string,
    bookPrice: number
  ): Promise<void> {
    try {
      const seller = await this.userRepository.findById(sellerId);

      if (seller) {
        const { subject, body } = this.templateService.getBookSoldTemplate(bookTitle, bookPrice);
        await this.emailService.sendEmailToSeller(seller.email, body, subject);
      }
    } catch (error) {
      if (error instanceof EmailServiceError) {
        this.loggerService.warn(error.message);
        return;
      }
      throw error;
    }
  }
}
