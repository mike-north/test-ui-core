import { AsyncMethodReturns } from '@mike-north/types';
import { Subject } from 'micro-observable';
import Penpal from 'penpal';
import { inAppEnvironment } from './client/utils';
import TestServer from './server';
import TaggedLogger, { Level } from './tagged-logger';

// tslint:disable-next-line:no-namespace
namespace TestClient {
  export interface Methods {
    receiveTestData(data: any): void;
  }
  export interface Options {
    frame: HTMLIFrameElement;
  }
}

export class Deferred<T> {
  resolve!: (value?: T | PromiseLike<T>) => void;
  reject!: (reason?: any) => void;
  promise!: Promise<T>;
  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

abstract class TestClient<
SM extends TestServer.Methods = TestServer.Methods
> {
  get ready() {
    return this.connDeferred.promise;
  }
  static debug = false;
  testDataSubject = new Subject<any>();
  protected frame: HTMLIFrameElement;
  protected connection!: ReturnType<typeof Penpal.connectToChild>;
  protected connDeferred: Deferred<any>;
  protected log: TaggedLogger = new TaggedLogger(TestClient.debug ? Level.Debug : Level.Warn);
  protected cleanupTasks: Array<() => void> = [];
  protected waiters: Array<Promise<any>> = [];
  constructor(opts: TestClient.Options) {
    this.log.pushTag('💻 TestClient');
    this.frame = opts.frame;
    this.connDeferred = new Deferred<AsyncMethodReturns<SM>>();
    if (inAppEnvironment()) {
        setTimeout(() => {
          this.connection = Penpal.connectToChild({
            url: this.getFrameUrl(),
            appendTo: this.frame,
            methods: this.buildMethods()
          });
          this.connection.promise.then(val => {
            return Promise.all(this.waiters).then(() => val);
          })
          .then(val => {
            this.connDeferred.resolve(val);
          });
        }, 0);
    } else {
      this.connDeferred.reject('Cannot run inside test environment');
    }
  }
  destroy() {
    this.testDataSubject.complete();
    this.connection.destroy();
    this.cleanupTasks.forEach(f => f());
  }
  protected buildMethods(): TestClient.Methods {
    const client = this;
    return {
      receiveTestData(data: any) {
        client.testDataSubject.next(data);
      }
    };
  }
  protected abstract getFrameUrl(): string;
}

export default TestClient;
