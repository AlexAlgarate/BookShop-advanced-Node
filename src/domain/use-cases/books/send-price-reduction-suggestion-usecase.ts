import 'reflect-metadata';
import { injectable, inject } from 'inversify';

import { Book, BookStatus } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { UserRepository } from '@domain/repositories/UserRepository';
import { EmailService } from '@domain/services/EmailService';
import { NotificationTemplateService } from '@domain/services/NotificationTemplateService';
import { BOOK_REPOSITORY, USER_REPOSITORY, EMAIL_SERVICE, NOTIFICATION_TEMPLATE_SERVICE } from '@di/tokens';

@injectable()
export class SendPriceReductionSuggestionUseCase {
  private readonly limitDays: number = 7;

  constructor(
    @inject(BOOK_REPOSITORY) private readonly bookRepository: BookRepository,
    @inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @inject(EMAIL_SERVICE) private readonly emailService: EmailService,
    @inject(NOTIFICATION_TEMPLATE_SERVICE) private readonly templateService: NotificationTemplateService
  ) {}

  public async execute(): Promise<void> {
    const users = await this.userRepository.find();

    const limitDate = this.getLimitDate(this.limitDays);

    for (const user of users) {
      const oldBooks = await this.getOldPublishedBooksForUser(user.id, limitDate);
      if (oldBooks.length === 0) continue;

      const { subject, body } = this.buildSuggestionEmail(oldBooks);

      await this.sendSuggestionEmail(user.email, body, subject);
    }
  }

  private getLimitDate(limitDays: number): Date {
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - limitDays);

    return limitDate;
  }

  private async getOldPublishedBooksForUser(ownerId: string, limitDate: Date): Promise<Book[]> {
    const response = await this.bookRepository.findMany({
      ownerId,
      page: 1,
      limit: 999,
    });

    return response.content.filter(book => {
      return book.status === BookStatus.PUBLISHED && book.createdAt < limitDate;
    });
  }

  private buildSuggestionEmail(oldBooks: Book[]): {
    subject: string;
    body: string;
  } {
    const bookList = oldBooks
      .map(book => ` - "${book.title}" (Precio actual: ${book.price} €)`)
      .join('\n');

    return this.templateService.getPriceReductionSuggestionTemplate(
      oldBooks.length,
      this.limitDays,
      bookList
    );
  }

  private async sendSuggestionEmail(email: string, body: string, subject: string): Promise<void> {
    await this.emailService.sendEmailToSeller(email, body, subject);
  }
}