export type Token = string | symbol;

export type Factory<T> = () => T;

export type ResolutionStrategy = 'singleton' | 'transient';

export interface Binding<T> {
  factory: Factory<T>;
  strategy: ResolutionStrategy;
}

export interface Container {
  register<T>(token: Token, factory: Factory<T>, strategy?: ResolutionStrategy): void;
  registerSingleton<T>(token: Token, factory: Factory<T>): void;
  resolve<T>(token: Token): T;
  createScope(): Container;
  registerInstance<T>(token: Token, instance: T): void;
}
