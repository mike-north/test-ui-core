import { AsyncMethodReturns } from '@mike-north/types';
import Penpal from 'penpal';
import isTesting from './is-testing';
import { TestServerMethods } from './server';

const PROMISE_UNDEFINED = Promise.resolve(undefined);

export class TestClientMethodsArg {
  serverReady?: () => void;
}

export interface TestClientMethods {
  onServerReady(): void;
}

const testClientMethods = (args: TestClientMethodsArg): TestClientMethods => ({
  onServerReady() {
    if (args.serverReady) args.serverReady();
  }
});

export default class TestClient<SM extends TestServerMethods = TestServerMethods> {
  private connection?: Penpal.IChildConnectionObject;
  constructor(frameContainer: HTMLIFrameElement, arg: TestClientMethodsArg = {}) {
    if (isTesting()) {
      return;
    } else {
      this.connection = Penpal.connectToChild({
        url: '/tests',
        appendTo: frameContainer,
        methods: testClientMethods(arg)
      });
      this.init();
    }
  }
  get ready(): Promise<AsyncMethodReturns<SM>> {
    return this.connection ? this.connection.promise : PROMISE_UNDEFINED;
  }
  private async init() {
    const conn = this.connection;
    if (!conn) return;
  }
}
