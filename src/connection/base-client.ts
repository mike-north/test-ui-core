import {
  AsyncMethodReturns,
  Deferred,
  OptionalProps,
  RequiredProps
} from '@mike-north/types';
import BaseClient from '../base-client';
import BaseObject from '../base-object';
import {
  State,
  StateId,
  StateReference
} from '../state';
import { TestDataEvent } from '../types';
import ServerConnection from './base-server';

// tslint:disable-next-line:no-namespace
namespace ClientConnection {
  export interface Options extends BaseObject.Options {}
  export interface Methods<DAT extends TestDataEvent = TestDataEvent> {
    onServerBoot(stateRef?: StateReference): any;
    onServerPrepared(state: State): any;
    receiveTestData(data: DAT): any;
  }
}

export type StateCache = { [K in StateId]: RequiredProps<State, 'id' | 'data'> };

/**
 * The client side of a client-server connection. The "client"
 * is usually the recipient of testing data, wheres the "server"
 * is where the tests are being run.
 */
abstract class ClientConnection extends BaseObject {
  protected get serverConn(): PromiseLike<
    AsyncMethodReturns<ServerConnection.Methods>
  > {
    return this.setupWork.promise;
  }
  protected prepareStateCache: StateCache = {};
  private setupWork = new Deferred<
    AsyncMethodReturns<ServerConnection.Methods>
  >();
  constructor(opts?: ClientConnection.Options) {
    super(opts);
    this.log.bgPaleGreen.pushPrefix('🔌Cl');
  }

  async setupClient(
    tc: BaseClient
  ): Promise<AsyncMethodReturns<ServerConnection.Methods>> {
    this.log.pushPrefix('setupClient').debug('begin');
    await tc.setupConnection(this);
    let result = await this.setupConnectionClient(tc);
    this.log.debug('special connection setup complete');
    this.setupWork.resolve(result);
    this.log.debug('complete');
    this.log.popPrefix();
    return result;
  }

  async prepareServer(partialState: OptionalProps<State, 'id'>) {
    this.log.debug('telling server to prepareServer');
    const state = await (await this.serverConn).prepare(partialState);
    this.prepareStateCache[state.id] = state as any;
    return state;
  }
  async runTests(state: State) {
    this.log.debug('telling server to runTests');
    return await (await this.serverConn).runTests(state);
  }
  protected abstract async setupConnectionClient(
    tc: BaseClient
  ): Promise<AsyncMethodReturns<ServerConnection.Methods>>;
}
export default ClientConnection;
