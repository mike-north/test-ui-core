import { Deferred } from '@mike-north/types';
import { Observable, Subject } from 'micro-observable';
import BaseObject from './base-object';
import ConnectionClient from './connection/base-client';
import { State } from './state';
import { AnyTestDataEvent, SuitePredicate } from './types';

// tslint:disable-next-line:no-namespace
namespace BaseClient {
  export interface Options extends BaseObject.Options {
    connection: ConnectionClient;
    enabled?: boolean;
  }
}

abstract class BaseClient extends BaseObject {
  protected enabled: boolean;
  protected testData = new Subject<AnyTestDataEvent>();
  get data(): Observable<AnyTestDataEvent> {
    return this.testData;
  }
  protected conn: ConnectionClient;
  private prepareWaiters: { [k: string]: Deferred<void> } = {};
  constructor(opts: BaseClient.Options) {
    super(opts);
    this.enabled = typeof opts.enabled === 'boolean' ? opts.enabled : true;
    this.log.blue.pushPrefix('💻Cl');
    this.conn = opts.connection;
    if (this.enabled) {
      this.conn.setupClient(this);
    } else {
      this.log.log('Disabled...Shutting down.');
    }
    this.cleanupOnDestroy.push(() => {
      this.testData.complete();
    });
  }
  // tslint:disable-next-line:no-empty
  async setupConnection(_conn: ConnectionClient) {}
  // tslint:disable-next-line:no-empty
  async onServerBoot() {}
  // tslint:disable-next-line:no-empty
  async onServerPrepared(state: State) {
    let d = this.prepareWaiters[state.id];
    if (d === void 0) {
      throw new Error(
        'Was notified that server prepared an unknown frame (id=' +
          state.id +
          ')'
      );
    }
    d.resolve();
  }
  async receiveTestData(data: AnyTestDataEvent) {
    this.testData.next(data);
  }
  async runModules(moduleFilter?: SuitePredicate) {
    if (!this.enabled) return;
    this.log.bgYellow.blue.pushPrefix('runModules');
    const state = await this.doPrepareServerFrame(moduleFilter);
    this.log.debug('server frame prepared (id=' + state.id + ')');
    (await this.conn).runTests(state);
    this.log.popPrefix();
  }
  protected async doPrepareServerFrame(
    moduleFilter?: SuitePredicate
  ): Promise<State> {
    await this.prepareServerFrame(moduleFilter);
    const state = await (await this.conn).prepareServer({ data: moduleFilter });
    const d = (this.prepareWaiters[state.id] = new Deferred<void>());
    this.log.white.bgOrangeRed.debug('sessionId = ' + state.id);
    await d.promise;
    return state;
  }
  protected abstract async prepareServerFrame(
    moduleFilter?: SuitePredicate
  ): Promise<any>;
}

export default BaseClient;
