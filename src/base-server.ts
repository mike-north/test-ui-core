import { OptionalProps } from '@mike-north/types';
import BaseObject from './base-object';
import ServerConnection from './connection/base-server';
import {
  State,
  createState
} from './state';
import {
  AnyTestDataEvent,
  SuitePredicate
} from './types';

// tslint:disable-next-line:no-namespace
namespace BaseServer {
  export interface Options extends BaseObject.Options {
    connection: ServerConnection;
  }
}

/**
 * The server accepts commands from the client, in order
 * to run tests and report back with results
 */
abstract class BaseServer extends BaseObject {
  /** The connection to the client */
  protected conn: ServerConnection;
  /** A promise that resolves once all connection setup work is done */
  private connectionSetupComplete: Promise<any>;
  constructor(opts: BaseServer.Options) {
    super(opts);
    this.log.green.pushPrefix('🎯Srv');
    this.conn = opts.connection;
    this.connectionSetupComplete = this.conn.setupServer(this);
  }
  /**
   * Boot the server, ultimately informing the client
   * that it's ready to prepare for a test run, and then finally run
   */
  async start(): Promise<void> {
    await this.connectionSetupComplete;
    const stateRef = await this.boot();
    (await this.conn).notifyIsBooted(stateRef);
  }

  // tslint:disable-next-line:no-empty
  async setupConnection(_conn: ServerConnection) {}
  prepare(partialState: OptionalProps<State, 'id'>): State {
    const { id, data: moduleFilter } = partialState;
    let state: State;
    if (typeof id === 'undefined') {
      state = createState(moduleFilter);
      this.log.debug('created new state', state);
    } else {
      state = { id, data: partialState.data };
      this.log.debug('reconstructed state state', state);
    }
    this.prepareEnvironment(state).then(({ ready }) => {
      if (ready) {
        this.conn.notifyIsPrepared(state);
      } else {
        this.log.debug('server is not ready');
      }
    });
    return state;
  }
  doRunTests(moduleFilter?: SuitePredicate) {
    this.runTests(moduleFilter);
  }
  /**
   * Boot the server
   */
  protected abstract async boot(): Promise<{ id: string } | undefined>;

  protected abstract async prepareEnvironment(
    state: State
  ): Promise<{ ready: boolean }>;
  protected abstract async runTests(
    moduleFilter?: SuitePredicate
  ): Promise<void>;

  protected async sendTestData(data: AnyTestDataEvent): Promise<void> {
    return await this.conn.sendTestData(data);
  }
}

export default BaseServer;
