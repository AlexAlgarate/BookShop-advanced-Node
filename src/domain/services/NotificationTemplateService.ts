export interface NotificationTemplateService {
  getBookSoldTemplate(bookTitle: string, bookPrice: number): { subject: string; body: string };
  getPriceReductionSuggestionTemplate(
    booksCount: number,
    limitDays: number,
    bookDetails: string
  ): { subject: string; body: string };
}
