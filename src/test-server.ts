import Penpal from 'penpal';
import { TestClientMethods } from './test-client';

interface TestServerMethodsArg {
  startTests(): void;
}

export interface TestServerMethods {
  startTests(): void;
}

const testServerMethods = (args: TestServerMethodsArg): TestServerMethods => ({
  startTests() {
    return args.startTests();
  }
});

export default class TestServer {
  private connection!: Penpal.IConnectionObject;
  constructor(args: TestServerMethodsArg) {
    this.connection = Penpal.connectToParent({
      methods: testServerMethods(args)
    });
  }
  get ready(): Promise<TestClientMethods> {
    return this.connection.promise;
  }
}
