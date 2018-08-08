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
import { AnyTestDataEvent } from '../types';
import ConnectionServer from './base-server';

// tslint:disable-next-line:no-namespace
namespace ConnectionClient {
  export interface Options extends BaseObject.Options {}
  export interface Methods {
    onServerBoot(stateRef?: StateReference): any;
    onServerPrepared(state: State): any;
    receiveTestData(data: AnyTestDataEvent): any;
  }
}

export type StateCache = { [K in StateId]: RequiredProps<State, 'id' | 'data'> };

/**
 * The client side of a client-server connection. The "client"
 * is usually the recipient of testing data, wheres the "server"
 * is where the tests are being run.
 */
abstract class ConnectionClient extends BaseObject {
  protected get serverConn(): PromiseLike<
    AsyncMethodReturns<ConnectionServer.Methods>
  > {
    return this.setupWork.promise;
  }
  protected prepareStateCache: StateCache = {};
  private setupWork = new Deferred<
    AsyncMethodReturns<ConnectionServer.Methods>
  >();
  constructor(opts?: ConnectionClient.Options) {
    super(opts);
    this.log.bgPaleGreen.pushPrefix('🔌Cl');
  }

  async setupClient(
    tc: BaseClient
  ): Promise<AsyncMethodReturns<ConnectionServer.Methods>> {
    this.log.pushPrefix('setupClient').debug('begin');
    await tc.setupConnection(this);
    let result = await this.setupConnectionClient(tc);
    this.log.debug('special connection setup complete');
    this.setupWork.resolve(result);
    this.log.debug('complete');
    this.log.popPrefix();
    return result;
  }

  async prepareServer(partialState: OptionalProps<State, 'id'>): Promise<State> {
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
  ): Promise<AsyncMethodReturns<ConnectionServer.Methods>>;
}
export default ConnectionClient;
