import { AsyncMethodReturns, Deferred, OptionalProps } from '@mike-north/types';
import { State } from '@test-ui/core';
import ServerConnection from '@test-ui/core/connection/base-server';
import { suite, test } from 'qunit-decorators';
import * as __sinon from 'sinon';
import BaseClient from '../src/base-client';
import ConnectionClient from '../src/connection/base-client';
class TestClient extends BaseClient {
  calls: { [k: string]: any[] } = {};
  protected async prepareServerFrameImpl(...args: any[]): Promise<any> {
    this.calls.prepareServerFrameImpl
      ? this.calls.prepareServerFrameImpl.push(args)
      : (this.calls.prepareServerFrameImpl = [args]);
  }
}

class TestConnectionClient extends ConnectionClient {
  calls: { [k: string]: any[] } = {};
  protected async setupConnectionClient(
    ...args: any[]
  ): Promise<AsyncMethodReturns<ServerConnection.Methods>> {
    this.calls.setupConnectionClient
      ? this.calls.setupConnectionClient.push(args)
      : (this.calls.setupConnectionClient = [args]);
    const toReturn: AsyncMethodReturns<ServerConnection.Methods> = {
      prepare(_partialState: OptionalProps<State, 'id'>) {
        return Promise.resolve({ id: 'aaa' });
      },
      runTests(_state: State) {
        return Promise.resolve();
      }
    };
    return toReturn;
  }
}

@suite
export class ConnectionClientTests {
  sinon!: sinon.SinonSandbox;
  beforeEach() {
    this.sinon = __sinon.createSandbox();
  }
  afterEach() {
    this.sinon.restore();
  }

  @test
  'Can instantiate with no args'(assert: Assert) {
    let c = new TestConnectionClient();
    assert.ok(c);
  }

  @test
  async 'ConnectionClient#setupClient is invoked as a result of being passed into a TestClient constructor'(
    assert: Assert
  ) {
    const connection = new TestConnectionClient();
    assert.ok(connection, 'Connection exists');
    const setupClientSpy = connection.setupClient = this.sinon.spy(connection.setupClient);
    assert.equal(connection.calls.setupConnection, undefined, 'before passing connection into client, setupConnection has not yet been called');
    const client = new TestClient({
      connection
    });
    assert.ok(client, 'Client exists');
    assert.ok(setupClientSpy.calledOnce, 'setupClient was called once');
    assert.equal(setupClientSpy.args[0].length, 1, 'setupClient received one arg');
    assert.deepEqual(setupClientSpy.args[0][0], client, 'setupClient was was passed the client instance');
  }

  @test
  async 'After ConnectionClient#setupClient is invoked, the client instance is passed to TestClient#setupConnection'(
    assert: Assert
  ) {
    const connection = new TestConnectionClient();
    class C extends TestClient {
      // tslint:disable-next-line:no-empty
      setupConnection(..._args: any[]): any {}
    }
    const s = this.sinon.spy(C.prototype, 'setupConnection');
    const client = new C({
      connection
    });
    assert.ok(client);
    assert.ok(s.calledOnce, 'setupConnection was called once');
    assert.equal(s.args[0].length, 1, 'setupConnection received one arg');
    assert.deepEqual(s.args[0][0], connection, 'setupConnection was was passed the connection instance');
  }

  @test
  async 'The async work done ConnectionClient#setupClient makes ConnectionClient#runTests wait'(
    assert: Assert
  ) {
    const connection = new TestConnectionClient();

    const d = new Deferred();
    class C extends TestClient {
      // tslint:disable-next-line:no-empty
      async setupConnection(..._args: any[]): Promise<any> {
        return await d.promise;
      }
    }
    const client = new C({
      connection
    });
    assert.ok(client);
    const runTestsPromise = connection.runTests({ id: 'abc'});
    let resolveCount = 0;
    runTestsPromise.then(x => {
      resolveCount++;
      return x;
    });
    await new Promise(res => setTimeout(res, 10)); // wait 100ms
    assert.equal(resolveCount, 0, 'While setupConnection work remains unresolved, runTests waits');
    d.resolve();
    await new Promise(res => setTimeout(res, 10)); // wait 100ms
    assert.equal(resolveCount, 1, 'Once setupConnection work is resolved, runTests resumes');
  }

  @test
  async 'The async work done ConnectionClient#setupClient makes ConnectionClient#prepareServer wait'(
    assert: Assert
  ) {
    const connection = new TestConnectionClient();

    const d = new Deferred();
    class C extends TestClient {
      // tslint:disable-next-line:no-empty
      async setupConnection(..._args: any[]): Promise<any> {
        return await d.promise;
      }
    }
    const client = new C({
      connection
    });
    assert.ok(client);
    const prepareServerPromise = connection.prepareServer({ data: { name: 'foo' }});
    let resolveCount = 0;
    prepareServerPromise.then(x => {
      resolveCount++;
      return x;
    });
    await new Promise(res => setTimeout(res, 10)); // wait 100ms
    assert.equal(resolveCount, 0, 'While setupConnection work remains unresolved, prepareServer waits');
    d.resolve();
    await new Promise(res => setTimeout(res, 10)); // wait 100ms
    assert.equal(resolveCount, 1, 'Once setupConnection work is resolved, prepareServer resumes');
  }

}
