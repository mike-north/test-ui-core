import { TestClientMethods } from '@test-ui/core';
import Penpal from 'penpal';

export interface TestServerMethods {
  startTests(...args: any[]): any;
}

export type FunctionArgs<F> = F extends (a: infer A) => any
  ? [A]
  : F extends (a: infer A, b: infer B) => any
    ? [A, B]
    : F extends (a: infer A, b: infer B, c: infer C) => any
      ? [A, B, C]
      : F extends (a: infer A, b: infer B, c: infer C, d: infer D) => any
        ? [A, B, C, D]
        : F extends (
            a: infer A,
            b: infer B,
            c: infer C,
            d: infer D,
            e: infer E
          ) => any
          ? [A, B, C, D, E]
          : never;

export type ConstructorArgs<
  K extends { new (...args: any[]): any }
> = K extends { new (a: infer A): any }
  ? [A]
  : K extends { new (a: infer A, b: infer B): any }
    ? [A, B]
    : K extends { new (a: infer A, b: infer B, c: infer C): any }
      ? [A, B, C]
      : K extends { new (a: infer A, b: infer B, c: infer C, d: infer D): any }
        ? [A, B, C, D]
        : K extends {
            new (
              a: infer A,
              b: infer B,
              c: infer C,
              d: infer D,
              e: infer E
            ): any;
          }
          ? [A, B, C, D, E]
          : never;

export interface Deferred {
  resolve: FunctionArgs<ConstructorArgs<PromiseConstructor>[0]>[0];
  reject: FunctionArgs<ConstructorArgs<PromiseConstructor>[0]>[1];
}

export default abstract class TestServer<
  SM extends TestServerMethods = TestServerMethods,
  CM extends TestClientMethods = TestClientMethods
> {
  ready!: Promise<CM>;
  protected methods!: SM;
  private readyDeferred!: Deferred;
  private connection!: Penpal.IConnectionObject;
  constructor() {
    // kick off ready promise
    this.ready = this.becomeReady();
  }
  protected async beforeReady(): Promise<void> {
    return Promise.resolve();
  }

  protected async init(): Promise<void> {
    const methods = await this.setupMethods();
    this.connection = Penpal.connectToParent({
      methods
    });
    await this.readyDeferred.resolve();
    (await this.ready).onServerReady();
  }
  protected abstract async setupMethods(): Promise<SM>;
  private async becomeReady(): Promise<CM> {
    await new Promise<{}>((resolve, reject) => {
      this.readyDeferred = {
        resolve,
        reject
      };
    });
    await this.beforeReady();
    const client: CM = await this.connection.promise;
    await new Promise(res => {
      setTimeout(async () => {
        await this.init();
        res();
      });
    });
    return client;
  }
}
