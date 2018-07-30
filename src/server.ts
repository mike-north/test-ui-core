import { AsyncMethodReturns, Deferred } from '@mike-north/types';
import { TestClientMethods } from '@test-ui/core';
import { Value as JSONValue } from 'json-typescript';
import Penpal from 'penpal';
export interface TestServerMethods {
  startTests(...args: any[]): any;
}

export default abstract class TestServer<
  SM extends TestServerMethods = TestServerMethods,
  CM extends TestClientMethods = TestClientMethods
> {
  ready!: Promise<AsyncMethodReturns<CM>>;
  protected methods!: SM;
  protected debug: boolean = false;
  private readyDeferred!: Deferred;
  private connection!: Penpal.IConnectionObject;
  constructor() {
    // kick off ready promise
    this.log('instantiating server');
    this.becomeReady();
  }
  protected log(message: string, ...args: JSONValue[]) {
    if (this.debug) {
      console.log(`[${this.constructor.name}]: ${message}`, ...args);
    }
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
  }
  protected abstract async setupMethods(): Promise<SM>;
  private async becomeReady(): Promise<CM> {
    this.log('about to becomeReady!');
    this.ready = new Promise<{}>((resolve, reject) => {
      this.readyDeferred = {
        resolve,
        reject
      };
    }).then(() => {
      return this.connection.promise;
    });
    const initPromise = new Promise(res => {
      setTimeout(async () => {
        this.log('about to init!');
        await this.init();
        this.log('init complete!');
        res();
      }, 0);
    });
    this.log('waiting for init!');
    await initPromise;
    this.log('waiting for readyDeferred!');
    const r: AsyncMethodReturns<TestClientMethods> = (await this.ready) as any;
    r.onServerReady();
    this.log('onServerReady complete!');
    await this.beforeReady();
    this.log('beforeReady complete!');
    const client: CM = await this.connection.promise;
    this.log('client connection established!');
    return client;
  }
}
