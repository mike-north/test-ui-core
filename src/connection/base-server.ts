import { AsyncMethodReturns, Deferred, OptionalProps } from '@mike-north/types';
import BaseObject from '../base-object';
import BaseServer from '../base-server';
import { State, StateReference } from '../state';
import { AnyTestDataEvent } from '../types';
import ClientConnection from './base-client';

// tslint:disable-next-line:no-namespace
namespace ServerConnection {
  export interface Options extends BaseObject.Options {}
  export interface Methods {
    prepare(partialState: OptionalProps<State, 'id'>): State;
    runTests(state: State): void;
  }
}

abstract class ServerConnection extends BaseObject {
  protected get clientConn(): PromiseLike<
    AsyncMethodReturns<ClientConnection.Methods>
  > {
    return this.setupWork.promise;
  }
  private setupWork = new Deferred<
    AsyncMethodReturns<ClientConnection.Methods>
  >();
  constructor(opts?: ServerConnection.Options) {
    super(opts);
    this.log.pushPrefix('🔌Srv');
  }
  async setupServer(
    srv: BaseServer
  ): Promise<AsyncMethodReturns<ClientConnection.Methods>> {
    this.log.pushPrefix('setupServer').debug('begin');
    await srv.setupConnection(this);
    let result = await this.setupServerImpl(srv);
    this.log.debug('special setup complete');
    this.setupWork.resolve(result);
    this.log.popPrefix();
    return result;
  }
  async notifyIsBooted(stateRef?: StateReference) {
    return (await this.clientConn).onServerBoot(stateRef);
  }
  async notifyIsPrepared(state: State) {
    return (await this.clientConn).onServerPrepared(state);
  }
  abstract sendTestData(data: AnyTestDataEvent): any;
  protected abstract async setupServerImpl(
    srv: BaseServer
  ): Promise<AsyncMethodReturns<ClientConnection.Methods>>;
}

export default ServerConnection;
