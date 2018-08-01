import { AsyncMethodReturns } from '@mike-north/types';
import Penpal from 'penpal';
import TestClient from './client';
import TaggedLogger, { Level } from './tagged-logger';

// tslint:disable-next-line:no-namespace
namespace TestServer {
  export interface Methods {}
  export interface Options {}
}

class TestServer<CM extends TestClient.Methods = TestClient.Methods> {
  static debug = false;
  protected connection!: ReturnType<typeof Penpal.connectToParent>;
  protected connectionReady!: Promise<AsyncMethodReturns<CM>>;
  protected log: TaggedLogger = new TaggedLogger(
    TestServer.debug ? Level.Debug : Level.Warn
  );
  constructor(protected opts: TestServer.Options) {
    this.log.pushTag('🎯 TestServer');
    this.connectionReady = new Promise(res => {
      setTimeout(() => {
        res(this.becomeReady());
      }, 0);
    });
  }
  destroy() {
    this.connection.destroy();
  }
  protected buildMethods(): TestServer.Methods {
    return {};
  }
  protected async becomeReady(): Promise<AsyncMethodReturns<CM>> {
    await this.establishConnection();
    return this.connection.promise as Promise<AsyncMethodReturns<CM>>;
  }
  private async establishConnection() {
    this.log.debug('Establishing connection');
    this.connection = Penpal.connectToParent({
      methods: this.buildMethods()
    });
  }
}

export default TestServer;
