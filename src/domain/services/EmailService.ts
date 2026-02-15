export interface EmailService {
  sendEmailToSeller(email: string, message: string, subject: string): Promise<void>;
}
