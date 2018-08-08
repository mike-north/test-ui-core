import { AsyncMethodReturns, OptionalProps } from '@mike-north/types';
import { State } from '@test-ui/core';
import ServerConnection from '@test-ui/core/connection/base-server';
import { suite, test } from 'qunit-decorators';
import * as __sinon from 'sinon';
import BaseClient from '../src/base-client';
import ConnectionClient from '../src/connection/base-client';

class TestClient extends BaseClient {
  calls: { [k: string]: any[] | undefined } = {};
  get dataObservable() {
    return this.testData;
  }
  protected async prepareServerFrame(...args: any[]): Promise<any> {
    this.calls.prepareServerFrameImpl !== void 0
      ? this.calls.prepareServerFrameImpl.push(args)
      : (this.calls.prepareServerFrameImpl = [args]);
  }
}

class TestConnectionClient extends ConnectionClient {
  calls: { [k: string]: any[] | undefined } = {};
  protected async setupConnectionClient(
    ...args: any[]
  ): Promise<AsyncMethodReturns<ServerConnection.Methods>> {
    this.calls.setupConnectionClient !== void 0
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
export class BaseClientTests {
  sinon!: sinon.SinonSandbox;
  beforeEach() {
    this.sinon = __sinon.createSandbox();
  }
  afterEach() {
    this.sinon.restore();
  }

  @test
  async 'by default, client sets up connection on instantiation'(
    assert: Assert
  ) {
    const connection = new TestConnectionClient();
    const setupClientSpy = this.sinon.spy(connection, 'setupClient');
    let c = new TestClient({
      connection
    });
    assert.ok(c);
    assert.ok(setupClientSpy.calledOnce, 'setupClient was called once');
  }

  @test
  async 'when enabled, sets up connection on instantiation'(assert: Assert) {
    const connection = new TestConnectionClient();
    const setupClientSpy = this.sinon.spy(connection, 'setupClient');
    let c = new TestClient({
      enabled: true,
      connection
    });
    assert.ok(c);
    assert.ok(setupClientSpy.calledOnce, 'setupClient was called once');
  }

  @test
  async 'when disabled, it does not set up the connection'(assert: Assert) {
    const connection = new TestConnectionClient();
    const setupClientSpy = this.sinon.spy(connection, 'setupClient');
    let c = new TestClient({
      enabled: false,
      connection
    });
    assert.ok(c);
    assert.ok(setupClientSpy.notCalled, 'setupClient was not called');
  }

  @test
  async 'test data observable completes upon destruction'(assert: Assert) {
    const connection = new TestConnectionClient();
    let c = new TestClient({
      connection
    });
    const testValues: any[] = [];
    c.dataObservable.subscribe(x => testValues.push(x));
    c.receiveTestData('abc' as any);
    c.receiveTestData('abc' as any);
    c.receiveTestData('abc' as any);
    assert.deepEqual(
      testValues,
      ['abc', 'abc', 'abc'],
      'observable fires correct data'
    );
    c.destroy();
    try {
      await c.receiveTestData({ a: 1 } as any);
      assert.ok(false, 'This line should not be reached');
    } catch (e) {
      assert.ok(e, 'something is thrown');
      assert.ok(e instanceof Error, 'it is a subclass of Error');
      assert.ok(
        (e as Error).message.indexOf('already closed') >= 0,
        'Error message is correct'
      );
    }
    assert.deepEqual(
      testValues,
      ['abc', 'abc', 'abc'],
      'observable fires correct data'
    );
  }
}
