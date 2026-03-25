import { LoggerService } from '@domain/services/LoggerService';

export class ConsoleLoggerService implements LoggerService {
  log(message: string): void {
    console.log(message);
  }

  warn(message: string): void {
    console.warn(message);
  }

  error(message: string, error?: Error): void {
    console.error(message, error?.message ?? '');
  }
}
