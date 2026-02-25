import { Container, Factory, ResolutionStrategy, Token, Binding } from './types.js';

export class DIContainer implements Container {
  private bindings = new Map<Token, Binding<unknown>>();
  private singletons = new Map<Token, unknown>();
  private resolvingTokens = new Set<Token>();

  register<T>(token: Token, factory: Factory<T>, strategy: ResolutionStrategy = 'transient'): void {
    this.bindings.set(token, {
      factory,
      strategy,
    });
  }

  registerSingleton<T>(token: Token, factory: Factory<T>): void {
    this.bindings.set(token, {
      factory,
      strategy: 'singleton',
    });
  }

  registerInstance<T>(token: Token, instance: T): void {
    this.bindings.set(token, {
      factory: () => instance,
      strategy: 'singleton',
    });
  }

  resolve<T>(token: Token): T {
    const binding = this.bindings.get(token);

    if (!binding) {
      throw new Error(`No binding found for ${String(token)}`);
    }

    if (binding.strategy === 'singleton') {
      const existing = this.singletons.get(token);
      if (existing !== undefined) {
        return existing as T;
      }
    }

    if (this.resolvingTokens.has(token)) {
      throw new Error(
        `Circular dependency detected while resolving ${String(token)}. ` +
          `Resolution chain: ${[...this.resolvingTokens].map(String).join(' -> ')} -> ${String(token)}`
      );
    }

    this.resolvingTokens.add(token);
    try {
      const instance = binding.factory() as T;

      if (binding.strategy === 'singleton') {
        this.singletons.set(token, instance);
      }

      return instance;
    } finally {
      this.resolvingTokens.delete(token);
    }
  }

  createScope(): Container {
    const childContainer = new DIContainer();
    childContainer.bindings = new Map(this.bindings);
    childContainer.singletons = new Map(this.singletons);
    return childContainer;
  }
}

export const container = new DIContainer();
