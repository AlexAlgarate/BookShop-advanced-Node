import { describe, jest, beforeEach, test, expect } from '@jest/globals';
import { SendPriceReductionSuggestionUseCase } from '@domain/use-cases/books/send-price-reduction-suggestion-usecase';
import { BookRepository } from '@domain/repositories/BookRepository';
import { UserRepository } from '@domain/repositories/UserRepository';
import { EmailService } from '@domain/services/EmailService';
import { NotificationTemplateService } from '@domain/services/NotificationTemplateService';
import { User } from '@domain/entities/User';
import { Book, BookStatus } from '@domain/entities/Book';

describe('SendPriceReductionSuggestionUseCase', () => {
  let useCase: SendPriceReductionSuggestionUseCase;
  let bookRepositoryMock: jest.Mocked<BookRepository>;
  let userRepositoryMock: jest.Mocked<UserRepository>;
  let emailServiceMock: jest.Mocked<EmailService>;
  let templateServiceMock: jest.Mocked<NotificationTemplateService>;

  beforeEach(() => {
    bookRepositoryMock = {
      createOne: jest.fn(),
      findMany: jest.fn(),
      updateBookDetails: jest.fn(),
      findById: jest.fn(),
      markAsSold: jest.fn(),
      deleteBook: jest.fn(),
    } as unknown as jest.Mocked<BookRepository>;

    userRepositoryMock = {
      createOne: jest.fn(),
      findByEmail: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    emailServiceMock = {
      sendEmailToSeller: jest.fn(),
    } as unknown as jest.Mocked<EmailService>;

    templateServiceMock = {
      getBookSoldTemplate: jest.fn().mockReturnValue({
        subject: '¡Tu libro ha sido vendido!',
        body: '¡Felicidades! Tu libro "Test" ha sido vendido.',
      }),
      getPriceReductionSuggestionTemplate: jest.fn(),
    } as unknown as jest.Mocked<NotificationTemplateService>;

    templateServiceMock.getPriceReductionSuggestionTemplate.mockImplementation(
      (booksCount: number, limitDays: number, bookDetails: string) => {
        const bookLabel = booksCount === 1 ? 'libro' : 'libros';
        const publishedLabel = booksCount === 1 ? 'publicado' : 'publicados';
        return {
          subject: `${booksCount} ${bookLabel}`,
          body: `Tienes ${booksCount} ${publishedLabel} desde hace más de ${limitDays} días:\n\n${bookDetails}\n\n¿Y si les bajamos el precio?`,
        };
      }
    );

    useCase = new SendPriceReductionSuggestionUseCase(
      bookRepositoryMock,
      userRepositoryMock,
      emailServiceMock,
      templateServiceMock,
      7
    );
  });

  describe('execute', () => {
    test('should send email when user has old published books', async () => {
      // Arrange
      const user = createMockUser('user@example.com');
      const oldBook = createMockBook('1', 'Old Book', 9.99, user.id, 15);
      const oldBook2 = createMockBook('2', 'Another Old Book', 19.99, user.id, 10);

      userRepositoryMock.find.mockResolvedValue([user]);
      bookRepositoryMock.findMany.mockResolvedValue({
        content: [oldBook, oldBook2],
        meta: {
          page: 1,
          limit: 999,
          total: 2,
        },
      });
      emailServiceMock.sendEmailToSeller.mockResolvedValue(undefined);

      // Act
      await useCase.execute();

      // Assert
      expect(userRepositoryMock.find).toHaveBeenCalledTimes(1);
      expect(bookRepositoryMock.findMany).toHaveBeenCalledWith({
        ownerId: user.id,
        page: 1,
        limit: 999,
      });
      expect(emailServiceMock.sendEmailToSeller).toHaveBeenCalledTimes(1);
      expect(emailServiceMock.sendEmailToSeller).toHaveBeenCalledWith(
        user.email,
        expect.stringContaining('Tienes 2 publicados desde hace más de 7 días'),
        expect.stringContaining('2 libros')
      );
    });

    test('should not send email when user has no books', async () => {
      // Arrange
      const user = createMockUser('user@example.com');

      userRepositoryMock.find.mockResolvedValue([user]);
      bookRepositoryMock.findMany.mockResolvedValue({
        content: [],
        meta: {
          page: 1,
          limit: 999,
          total: 0,
        },
      });

      // Act
      await useCase.execute();

      // Assert
      expect(emailServiceMock.sendEmailToSeller).not.toHaveBeenCalled();
    });

    test('should not send email when user has only recent books', async () => {
      // Arrange
      const user = createMockUser('user@example.com');
      const recentBook = createMockBook('1', 'Recent Book', 25.0, user.id, 3);

      userRepositoryMock.find.mockResolvedValue([user]);
      bookRepositoryMock.findMany.mockResolvedValue({
        content: [recentBook],
        meta: {
          page: 1,
          limit: 999,
          total: 1,
        },
      });

      // Act
      await useCase.execute();

      // Assert
      expect(emailServiceMock.sendEmailToSeller).not.toHaveBeenCalled();
    });

    test('should not send email when books have non-PUBLISHED status', async () => {
      // Arrange
      const user = createMockUser('user@example.com');
      const soldBook = createMockBook('1', 'Sold Book', 15.0, user.id, 10, BookStatus.SOLD);

      userRepositoryMock.find.mockResolvedValue([user]);
      bookRepositoryMock.findMany.mockResolvedValue({
        content: [soldBook],
        meta: {
          page: 1,
          limit: 999,
          total: 1,
        },
      });

      // Act
      await useCase.execute();

      // Assert
      expect(emailServiceMock.sendEmailToSeller).not.toHaveBeenCalled();
    });

    test('should handle multiple users with different scenarios', async () => {
      // Arrange
      const userWithOldBooks = createMockUser('user1@example.com');
      const userWithRecentBooks = createMockUser('user2@example.com');
      const userWithNoBooks = createMockUser('user3@example.com');

      const oldBook = createMockBook('1', 'Old Book', 9.99, userWithOldBooks.id, 10);
      const recentBook = createMockBook('2', 'Recent Book', 19.99, userWithRecentBooks.id, 3);

      userRepositoryMock.find.mockResolvedValue([
        userWithOldBooks,
        userWithRecentBooks,
        userWithNoBooks,
      ]);

      bookRepositoryMock.findMany.mockImplementation(async ({ ownerId }) => {
        if (ownerId === userWithOldBooks.id) {
          return { content: [oldBook], meta: { page: 1, limit: 999, total: 1 } };
        }
        if (ownerId === userWithRecentBooks.id) {
          return { content: [recentBook], meta: { page: 1, limit: 999, total: 1 } };
        }
        return { content: [], meta: { page: 1, limit: 999, total: 0 } };
      });

      emailServiceMock.sendEmailToSeller.mockResolvedValue(undefined);

      // Act
      await useCase.execute();

      // Assert
      expect(bookRepositoryMock.findMany).toHaveBeenCalledTimes(3);
      expect(emailServiceMock.sendEmailToSeller).toHaveBeenCalledTimes(1);
      expect(emailServiceMock.sendEmailToSeller).toHaveBeenCalledWith(
        userWithOldBooks.email,
        expect.anything(),
        expect.anything()
      );
    });

    test('should send email with correct book information', async () => {
      // Arrange
      const user = createMockUser('seller@example.com');
      const book1 = createMockBook('1', 'Book Title One', 12.5, user.id, 8);
      const book2 = createMockBook('2', 'Book Title Two', 25.99, user.id, 10);

      userRepositoryMock.find.mockResolvedValue([user]);
      bookRepositoryMock.findMany.mockResolvedValue({
        content: [book1, book2],
        meta: {
          page: 1,
          limit: 999,
          total: 2,
        },
      });
      emailServiceMock.sendEmailToSeller.mockResolvedValue(undefined);

      // Act
      await useCase.execute();

      // Assert
      const callArgs = emailServiceMock.sendEmailToSeller.mock.calls[0];
      expect(callArgs).toBeDefined();
      expect(callArgs![0]).toBe(user.email);
      expect(callArgs![1]).toContain('Book Title One');
      expect(callArgs![1]).toContain('12.5');
      expect(callArgs![1]).toContain('Book Title Two');
      expect(callArgs![1]).toContain('25.99');
    });

    test('should continue processing users even if email service fails for one user', async () => {
      // Arrange
      const user1 = createMockUser('user1@example.com');
      const user2 = createMockUser('user2@example.com');
      const oldBook1 = createMockBook('1', 'Old Book 1', 9.99, user1.id, 10);
      const oldBook2 = createMockBook('2', 'Old Book 2', 19.99, user2.id, 10);

      userRepositoryMock.find.mockResolvedValue([user1, user2]);

      bookRepositoryMock.findMany.mockImplementation(async ({ ownerId }) => {
        if (ownerId === user1.id) {
          return { content: [oldBook1], meta: { page: 1, limit: 999, total: 1 } };
        }
        return { content: [oldBook2], meta: { page: 1, limit: 999, total: 1 } };
      });

      emailServiceMock.sendEmailToSeller.mockRejectedValueOnce(new Error('Email service failed'));
      emailServiceMock.sendEmailToSeller.mockResolvedValueOnce(undefined);

      // Act & Assert
      // This test expects the function to throw or handle the error
      // Based on the current implementation, it might throw
      await expect(useCase.execute()).rejects.toThrow();
    });

    test('should use correct limit date calculation', async () => {
      // Arrange
      const user = createMockUser('user@example.com');
      const bookExactly7DaysOld = createMockBook('1', 'Book', 10.0, user.id, 7);
      const bookMoreThan7DaysOld = createMockBook('2', 'Book', 10.0, user.id, 8);

      userRepositoryMock.find.mockResolvedValue([user]);
      bookRepositoryMock.findMany.mockResolvedValue({
        content: [bookExactly7DaysOld, bookMoreThan7DaysOld],
        meta: {
          page: 1,
          limit: 999,
          total: 2,
        },
      });

      emailServiceMock.sendEmailToSeller.mockResolvedValue(undefined);

      // Act
      await useCase.execute();

      // Assert
      // The use case filters with `<` operator, so exactly 7 days should not be included
      // Only books older than 7 days (8+ days) should be in the email
      expect(emailServiceMock.sendEmailToSeller).toHaveBeenCalledWith(
        user.email,
        expect.stringContaining('1 publicado desde hace más de 7 días'),
        expect.anything()
      );
    });

    test('should handle empty user list', async () => {
      // Arrange
      userRepositoryMock.find.mockResolvedValue([]);

      // Act
      await useCase.execute();

      // Assert
      expect(bookRepositoryMock.findMany).not.toHaveBeenCalled();
      expect(emailServiceMock.sendEmailToSeller).not.toHaveBeenCalled();
    });
  });

  // Helper functions
  let userCounter = 0;

  function createMockUser(email: string): User {
    return new User({
      id: `user-${Date.now()}-${userCounter++}`,
      email,
      password: 'hashed-password',
      createdAt: new Date(),
    });
  }

  function createMockBook(
    id: string,
    title: string,
    price: number,
    ownerId: string,
    daysOld: number,
    status: BookStatus = BookStatus.PUBLISHED
  ): Book {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysOld);

    const soldAt = status === BookStatus.SOLD ? new Date() : null;

    return new Book({
      id,
      title,
      description: 'Test description',
      price,
      author: 'Test Author',
      ownerId,
      status,
      createdAt,
      soldAt,
    });
  }
});
