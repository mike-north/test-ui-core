import { AsyncMethodReturns, OptionalProps } from '@mike-north/types';
import { Level } from 'bite-log';
import { PredicateObject } from 'object-predicate';
import { suite, test } from 'qunit-decorators';
import * as __sinon from 'sinon';
import BaseClient from '../src/base-client';
import BaseServer from '../src/base-server';
import ClientConnection from '../src/connection/base-client';
import ServerConnection from '../src/connection/base-server';
import { State, StateReference } from '../src/state';
import { AnyTestDataEvent, TestModule } from '../src/types';

class TestClient extends BaseClient {
  async doPrepareServerFrame(
    moduleFilter?: PredicateObject<TestModule>
  ): Promise<State> {
    return super.doPrepareServerFrame.call(this, moduleFilter);
  }
  // tslint:disable-next-line:no-empty
  async prepareServerFrame(..._args: any[]): Promise<any> {}
}

class TestServer extends BaseServer {
  boot(): Promise<{ id: string } | undefined> {
    return Promise.resolve(undefined);
  }
  prepareEnvironment(_state: State): Promise<{ ready: boolean }> {
    throw new Error('Method not implemented.');
  }
  runTests(
    _moduleFilter?: PredicateObject<TestModule> | undefined
  ): Promise<void> {
    return Promise.resolve();
  }
}

class ServerTestConnection extends ServerConnection {
  client?: ClientTestConnection;
  server?: TestServer;
  calls: { [k: string]: any[] } = {};
  // tslint:disable-next-line:no-empty
  sendTestData(..._args: any[]): any {}
  // tslint:disable-next-line:no-empty
  onServerBoot(_stateRef?: StateReference): any {}
  // tslint:disable-next-line:no-empty
  onServerPrepared(_state: State): any {}
  // tslint:disable-next-line:no-empty
  receiveTestData(_data: AnyTestDataEvent): any {}
  prepare(_partialState: OptionalProps<State, 'id'>): State {
    this.clientConn.then(c => {
      setTimeout(() => {
        c.onServerPrepared({ id: 'aaa' });
      }, 100);
    });
    return { id: 'aaa'};
  }
  runTests(_state: State) {
    if (typeof this.server === 'undefined') throw new Error('No server');
    this.server.doRunTests(_state.data);
  }
  protected async setupServerImpl(
    _srv: BaseServer
  ): Promise<AsyncMethodReturns<ClientConnection.Methods>> {
    this.server = _srv as any;
    const self = this;
    return {
      // tslint:disable-next-line:no-empty
      onServerBoot(_stateRef?: StateReference): any {
        const { client } = self;
        if (client === void 0) throw new Error('No client');
        return Promise.resolve(client.onServerBoot(_stateRef));
      },
      // tslint:disable-next-line:no-empty
      onServerPrepared(_state: State): any {
        const { client } = self;
        if (client === void 0) throw new Error('No client');
        return Promise.resolve(client.onServerPrepared(_state));
      },
      // tslint:disable-next-line:no-empty
      receiveTestData(_data: AnyTestDataEvent): any {
        const { client } = self;
        if (client === void 0) throw new Error('No client');
        return Promise.resolve(client.receiveTestData(_data));
      }
    };
  }
}

class ClientTestConnection extends ClientConnection {
  srv?: ServerTestConnection;
  client?: TestClient;
  // tslint:disable-next-line:no-empty
  onServerBoot(_stateRef?: StateReference): any {

  }
  // tslint:disable-next-line:no-empty
  onServerPrepared(_state: State): any {
    if (this.client === void 0) throw new Error('no client');
    this.client.onServerPrepared(_state);
  }
  // tslint:disable-next-line:no-empty
  receiveTestData(_data: AnyTestDataEvent): any {

  }
  protected async setupConnectionClient(
    tc: TestClient
  ): Promise<AsyncMethodReturns<ServerConnection.Methods>> {
    this.client = tc;
    const self = this;
    return {
      prepare(_partialState: OptionalProps<State, 'id'>): Promise<State> {
        const { srv } = self;
        if (srv === void 0) throw new Error('No server');
        return Promise.resolve(srv.prepare(_partialState));
      },
      runTests(_state: State) {
        const { srv } = self;
        if (srv === void 0) throw new Error('No server');
        return Promise.resolve(srv.runTests(_state));
      }
    };
  }
}

@suite
export class ClientServerTests {
  sinon!: sinon.SinonSandbox;
  beforeEach() {
    this.sinon = __sinon.createSandbox();
  }
  afterEach() {
    this.sinon.restore();
  }
  @test
  async 'Client-Server communication happens in correct order'(assert: Assert) {
    const cConn = new ClientTestConnection({ logLevel: Level.debug });
    const originalSetupClient = cConn.setupClient;
    this.sinon
      .stub(cConn, 'setupClient')
      .callsFake(tc => {
        assert.step('cConnSetupClientStub');
        return originalSetupClient.call(cConn, tc);
      });
    const sConn = new ServerTestConnection({ logLevel: Level.debug });
    sConn.client = cConn;
    cConn.srv = sConn;
    const originalSetupServer = sConn.setupServer;
    this.sinon
      .stub(sConn, 'setupServer')
      .callsFake(ts => {
        assert.step('sConnSetupServerStub');
        return originalSetupServer.call(sConn, ts);
      });
    const client = new TestClient({
      logLevel: Level.debug,
      connection: cConn
    });
    const server = new TestServer({
      logLevel: Level.debug,
      connection: sConn
    });
    const originalServerStart = server.start;
    this.sinon.stub(server, 'start').callsFake(async () => {
      assert.step('serverStart');
      return originalServerStart.call(server, ...arguments);
    });
    const originalServerBoot = server.boot;
    this.sinon.stub(server, 'boot').callsFake(() => {
      assert.step('serverBoot');
      return originalServerBoot.call(server, ...arguments);
    });
    const originalServerConnNotifyIsBooted = sConn.notifyIsBooted;
    this.sinon.stub(sConn, 'notifyIsBooted').callsFake(async () => {
      assert.step('sConnNotifyIsBooted');
      return await originalServerConnNotifyIsBooted.call(sConn, ...arguments);
    });
    const originalCconnOnServerBoot = cConn.onServerBoot;
    this.sinon.stub(cConn, 'onServerBoot').callsFake(async () => {
      assert.step('cConnOnServerBoot');
      return await originalCconnOnServerBoot.call(cConn, ...arguments);
    });
    const originalDpsf = client.doPrepareServerFrame;
    this.sinon.stub(client, 'doPrepareServerFrame').callsFake(async () => {
      assert.step('clientDoPrepareServerFrame');
      return await originalDpsf.call(client, ...arguments);
    });
    const originalPsf = client.prepareServerFrame;
    this.sinon.stub(client, 'prepareServerFrame').callsFake(async () => {
      assert.step('clientPrepareServerFrame');
      return await originalPsf.call(client, ...arguments);
    });
    const originalRunTests = server.runTests;
    this.sinon.stub(server, 'runTests').callsFake(async () => {
      assert.step('serverRunTests');
      return await originalRunTests.call(server, ...arguments);
    });

    assert.ok(client, 'client exists');
    assert.ok(server, 'server exists');

    assert.verifySteps([
      // These first two are only in order of client, server
      // because of the order we instantiated them above
      'cConnSetupClientStub',
      'sConnSetupServerStub'
    ]);
    await server.start();

    assert.verifySteps(['serverStart', 'serverBoot',
    'sConnNotifyIsBooted', 'cConnOnServerBoot']);

    const runModulesPromise = client.runModules({ name: 'purple' });
    await runModulesPromise;
    await new Promise(r => setTimeout(r, 300));
    assert.verifySteps(['clientDoPrepareServerFrame', 'clientPrepareServerFrame', 'serverRunTests']);
  }
}
