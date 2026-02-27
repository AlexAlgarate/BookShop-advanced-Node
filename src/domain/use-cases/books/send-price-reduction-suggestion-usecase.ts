import { Book, BookStatus } from '@domain/entities/Book';
import { BookRepository } from '@domain/repositories/BookRepository';
import { UserRepository } from '@domain/repositories/UserRepository';
import { EmailService } from '@domain/services/EmailService';

export class SendPriceReductionSuggestionUseCase {
  private readonly bookRepository: BookRepository;
  private readonly userRepository: UserRepository;
  private readonly emailService: EmailService;
  private readonly limitDays: number;

  constructor(
    bookRepository: BookRepository,
    userRepository: UserRepository,
    emailService: EmailService,
    limitDays = 7
  ) {
    this.bookRepository = bookRepository;
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.limitDays = limitDays;
  }

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

    const subject = `Sugerencia para que bajes el precio de ${oldBooks.length} ${oldBooks.length === 1 ? 'libro' : 'libros'}`;

    const body = `
      Tienes ${oldBooks.length} publicado${oldBooks.length === 1 ? '' : 's'} desde hace más de ${this.limitDays} días:

      ${bookList}

      ¿Y si les bajamos el precio?  
    `.trim();

    return { subject, body };
  }

  private async sendSuggestionEmail(email: string, body: string, subject: string): Promise<void> {
    await this.emailService.sendEmailToSeller(email, body, subject);
  }
}
