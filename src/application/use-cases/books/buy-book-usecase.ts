import { Book } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { UserRepository } from '@domain/repositories/UserRepository';
import { EmailService } from '@domain/services/EmailService';
import { NotificationTemplateService } from '@domain/services/NotificationTemplateService';
import { LoggerService } from '@domain/services/LoggerService';
import { EmailServiceError, EntityNotFoundError } from '@domain/types/errors';
import { BuyBookQuery } from '@domain/types/book/BuyBookQuery';

export class BuyBookUseCase {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly templateService: NotificationTemplateService,
    private readonly loggerService: LoggerService
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