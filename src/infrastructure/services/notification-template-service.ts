import { NotificationTemplateService } from '@domain/services/NotificationTemplateService';

export class NotificationTemplateServiceImpl implements NotificationTemplateService {
  getBookSoldTemplate(bookTitle: string, bookPrice: number): { subject: string; body: string } {
    const subject = '¡Tu libro ha sido vendido!';
    const body = `
      ¡Felicidades! Tu libro "${bookTitle}" ha sido vendido.
      En los próximos días recibirás el dinero (${bookPrice}) en tu cuenta.
    `.trim();

    return { subject, body };
  }

  getPriceReductionSuggestionTemplate(
    booksCount: number,
    limitDays: number,
    bookDetails: string
  ): { subject: string; body: string } {
    const bookLabel = booksCount === 1 ? 'libro' : 'libros';
    const publishedLabel = booksCount === 1 ? 'publicado' : 'publicados';

    const subject = `Sugerencia para que bajes el precio de ${booksCount} ${bookLabel}`;

    const body = `
      Tienes ${booksCount} ${publishedLabel} desde hace más de ${limitDays} días:

      ${bookDetails}

      ¿Y si les bajamos el precio?  
    `.trim();

    return { subject, body };
  }
}
