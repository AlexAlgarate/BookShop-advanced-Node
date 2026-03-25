import { LoggerService } from '@domain/services/LoggerService';
import { ConsoleLoggerService } from '@infrastructure/services/console-logger-service';

let loggerInstance: LoggerService | null = null;

export const getLogger = (): LoggerService => {
  if (!loggerInstance) {
    loggerInstance = new ConsoleLoggerService();
  }
  return loggerInstance;
};
