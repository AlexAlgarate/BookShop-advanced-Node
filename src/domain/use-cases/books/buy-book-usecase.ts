import { Book } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { EntityNotFoundError } from '@domain/types/errors';
import { UserRepository } from '@domain/repositories/UserRepository';
import { EmailService } from '@domain/services/EmailService';
import { NotificationTemplateService } from '@domain/services/NotificationTemplateService';
import { BuyBookQuery } from '@domain/types/book/BuyBookQuery';

export class BuyBookUseCase {
  private readonly bookRepository: BookRepository;
  private readonly userRepository: UserRepository;
  private readonly emailService: EmailService;
  private readonly templateService: NotificationTemplateService;

  constructor(
    bookRepository: BookRepository,
    userRepository: UserRepository,
    emailService: EmailService,
    templateService: NotificationTemplateService
  ) {
    this.bookRepository = bookRepository;
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.templateService = templateService;
  }

  public async execute({ bookId, buyerId }: BuyBookQuery): Promise<Book | null> {
    const book = await this.bookRepository.findById(bookId);

    if (!book) {
      throw new EntityNotFoundError('Book', bookId);
    }

    const sellerId = book.ownerId;

    const soldBook = book.sellTo(buyerId);

    const updatedBook = await this.bookRepository.markAsSold(bookId, buyerId, soldBook.soldAt!);

    await this.notifyToSeller(sellerId, book.title, book.price);

    return updatedBook;
  }

  private async notifyToSeller(
    sellerId: string,
    bookTitle: string,
    bookPrice: number
  ): Promise<void> {
    const seller = await this.userRepository.findById(sellerId);

    if (seller) {
      const { subject, body } = this.templateService.getBookSoldTemplate(bookTitle, bookPrice);

      await this.emailService.sendEmailToSeller(seller.email, body, subject);
    }
  }
}
