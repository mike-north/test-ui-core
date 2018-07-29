import Penpal from 'penpal';
import isTesting from './is-testing';
import { TestServerMethods } from './server';

const PROMISE_UNDEFINED = Promise.resolve(undefined);

class TestClientMethodsArg {
  serverReady?: () => void;
}
export interface TestClientMethods {
  onServerReady(): void;
}

const testClientMethods = (args: TestClientMethodsArg): TestClientMethods => ({
  onServerReady() {
    if (args.serverReady) args.serverReady();
  }
})

export default class TestClient {
  private connection?: Penpal.IChildConnectionObject
  constructor(frameContainer: HTMLIFrameElement, arg: TestClientMethodsArg = {}) {
    if (isTesting) return; 
    this.connection = Penpal.connectToChild({
      url: '/tests',
      appendTo: frameContainer,
      methods: testClientMethods(arg)
    });
  }
  get ready(): Promise<TestServerMethods | undefined> {
    return this.connection ? this.connection.promise : PROMISE_UNDEFINED;
  }
}
