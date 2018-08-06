import { AsyncMethodReturns, Deferred } from '@mike-north/types';
import { PredicateObject } from 'object-predicate';
import { suite, test } from 'qunit-decorators';
import * as __sinon from 'sinon';
import BaseServer from '../src/base-server';
import ConnectionClient from '../src/connection/base-client';
import ConnectionServer from '../src/connection/base-server';
import { State, StateReference } from '../src/state';
import { TestDataEvent, TestModule } from '../src/types';

class TestServer extends BaseServer {
  calls: { [k: string]: any[] } = {};
  protected boot(): Promise<{ id: string } | undefined> {
    throw new Error('Method not implemented.');
  }
  protected prepareEnvironment(_state: State): Promise<{ ready: boolean }> {
    throw new Error('Method not implemented.');
  }
  protected runTestsImpl(
    _moduleFilter?: PredicateObject<TestModule> | undefined
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

class ServerTestConnection extends ConnectionServer {
  calls: { [k: string]: any[] } = {};
  // tslint:disable-next-line:no-empty
  sendTestData(..._args: any[]): any {}
  protected async setupServerImpl(
    _srv: BaseServer
  ): Promise<AsyncMethodReturns<ConnectionClient.Methods>> {
    return {
      // tslint:disable-next-line:no-empty
      onServerBoot(_stateRef?: StateReference): any {},
      // tslint:disable-next-line:no-empty
      onServerPrepared(_state: State): any {},
      // tslint:disable-next-line:no-empty
      receiveTestData(_data: TestDataEvent): any {}
    };
  }
}

@suite
export class ConnectionServerTests {
  sinon!: sinon.SinonSandbox;
  beforeEach() {
    this.sinon = __sinon.createSandbox();
  }
  afterEach() {
    this.sinon.restore();
  }

  @test
  'Can instantiate with no args'(assert: Assert) {
    let c = new ServerTestConnection();
    assert.ok(c);
  }

  @test
  async 'ConnectionServer#setupServer is invoked as a result of being passed into a Server constructor'(
    assert: Assert
  ) {
    const connection = new ServerTestConnection();
    assert.ok(connection, 'Connection exists');
    const setupServerSpy = connection.setupServer = this.sinon.spy(connection.setupServer);
    assert.equal(connection.calls.setupConnection, undefined, 'before passing connection into server, setupConnection has not yet been called');
    const server = new TestServer({
      connection
    });
    assert.ok(server, 'Server exists');
    assert.ok(setupServerSpy.calledOnce, 'setupServer was called once');
    assert.equal(setupServerSpy.args[0].length, 1, 'setupServer received one arg');
    assert.deepEqual(setupServerSpy.args[0][0], server, 'setupServer was was passed the server instance');
  }

  @test
  async 'After ConnectionServer#setupServer is invoked, the Server instance is passed to TestServer#setupConnection'(
    assert: Assert
  ) {
    const connection = new ServerTestConnection();
    class C extends TestServer {
      // tslint:disable-next-line:no-empty
      setupConnection(..._args: any[]): any {}
    }
    const s = this.sinon.spy(C.prototype, 'setupConnection');
    const server = new C({
      connection
    });
    assert.ok(server);
    assert.ok(s.calledOnce, 'setupConnection was called once');
    assert.equal(s.args[0].length, 1, 'setupConnection received one arg');
    assert.deepEqual(s.args[0][0], connection, 'setupConnection was was passed the connection instance');
  }

  @test
  async 'The async work done ConnectionServer#setupServer makes ConnectionServer#notifyIsBooted wait'(
    assert: Assert
  ) {
    const connection = new ServerTestConnection();

    const d = new Deferred();
    class Srv extends TestServer {
      // tslint:disable-next-line:no-empty
      async setupConnection(..._args: any[]): Promise<any> {
        return await d.promise;
      }
    }
    const server = new Srv({
      connection
    });
    assert.ok(server);
    const notifyIsBootedPromise = connection.notifyIsBooted({ id: 'abc'});
    let resolveCount = 0;
    notifyIsBootedPromise.then(x => {
      resolveCount++;
      return x;
    });
    await new Promise(res => setTimeout(res, 10)); // wait 100ms
    assert.equal(resolveCount, 0, 'While setupConnection work remains unresolved, notifyIsBooted waits');
    d.resolve();
    await new Promise(res => setTimeout(res, 10)); // wait 100ms
    assert.equal(resolveCount, 1, 'Once setupConnection work is resolved, notifyIsBooted resumes');
  }

  @test
  async 'The async work done ConnectionServer#setupServer makes ConnectionServer#notifyIsPrepared wait'(
    assert: Assert
  ) {
    const connection = new ServerTestConnection();

    const d = new Deferred();
    class Srv extends TestServer {
      // tslint:disable-next-line:no-empty
      async setupConnection(..._args: any[]): Promise<any> {
        return await d.promise;
      }
    }
    const server = new Srv({
      connection
    });
    assert.ok(server);
    const notifyIsPreparedPromise = connection.notifyIsPrepared({ id: 'abc'});
    let resolveCount = 0;
    notifyIsPreparedPromise.then(x => {
      resolveCount++;
      return x;
    });
    await new Promise(res => setTimeout(res, 10)); // wait 100ms
    assert.equal(resolveCount, 0, 'While setupConnection work remains unresolved, notifyIsPrepared waits');
    d.resolve();
    await new Promise(res => setTimeout(res, 10)); // wait 100ms
    assert.equal(resolveCount, 1, 'Once setupConnection work is resolved, notifyIsPrepared resumes');
  }

}
