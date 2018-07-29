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
  private setupPromise: Promise<any>;
  constructor(frameContainer: HTMLIFrameElement, arg: TestClientMethodsArg = {}) {
    let resolve: any;
    this.setupPromise = new Promise(r => {
      resolve = r;
    });
    if (isTesting()) {
      return;
    } else {
      this.connection = Penpal.connectToChild({
        url: '/tests',
        appendTo: frameContainer,
        methods: testClientMethods(arg)
      });
      this.init(resolve);
    }
  }
  private async init(resolve: any) {
    const conn = this.connection;
    if (!conn) return;
    resolve(await conn.promise);
  }
  get ready(): Promise<SM | undefined> {
    return this.connection ? this.setupPromise : PROMISE_UNDEFINED;
    // return this.connection ? this.connection.promise : PROMISE_UNDEFINED;
  }
}
