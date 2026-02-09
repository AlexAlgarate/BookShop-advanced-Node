import dotenv, { config } from 'dotenv';
import * as z from 'zod';

const environmentVariablesValidator = z.object({
  ENVIRONMENT: z.enum(['local', 'staging', 'production']),
  API_PORT: z.string(),
  MONGO_USER: z.string(),
  MONGO_PASSWORD: z.string(),
  MONGO_HOST: z.string(),
  JWT_SECRET: z.string(),
  SENTRY_DSN: z.url(),
  MAILTRAP_TOKEN: z.string(),
  INBOXID: z.string(),
  IS_SANDBOX: z.string(),
});

type EnvironmentVariables = z.infer<typeof environmentVariablesValidator>;

class EnvironmentService {
  private environmentVariables: EnvironmentVariables | null = null;

  load(): void {
    if (this.environmentVariables) return;

    const currentEnvironment = process.env.NODE_ENV ?? '';
    const environmentFile = this.getEnvironmentFile(currentEnvironment);

    const variables: dotenv.DotenvConfigOutput = config({ path: environmentFile });

    if (variables.error) {
      throw new Error(`Error reading environment variables: ${variables.error.message}`);
    }

    try {
      this.environmentVariables = environmentVariablesValidator.parse(variables.parsed);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? `Error validating environment variables ${error.message}` : '';
      throw new Error(`Error validating environment variables: ${errorMessage}`);
    }
  }

  get(): EnvironmentVariables {
    if (!this.environmentVariables) {
      throw new Error('Environment variables are not loaded. Use load method first');
    }
    return this.environmentVariables;
  }

  private getEnvironmentFile(
    currentEnvironment: string
  ): '.env.production' | '.env.staging' | '.env' {
    switch (currentEnvironment) {
      case 'production':
        return '.env.production';
      case 'staging':
        return '.env.staging';
      default:
        return '.env';
    }
  }
}

export const environmentService = new EnvironmentService();
