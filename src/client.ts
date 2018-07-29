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
})

export default class TestClient {
  private connection?: Penpal.IChildConnectionObject;
  constructor(frameContainer: HTMLIFrameElement, arg: TestClientMethodsArg = {}) {
    console.log('entered test client constructor');
    if (isTesting) {
      console.log('test environment detected');
      return;
    } else {
      console.log('test environment NOT detected');
    }
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
