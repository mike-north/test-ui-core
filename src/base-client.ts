import { Deferred } from '@mike-north/types';
import { Subject } from 'micro-observable';
import { PredicateObject } from 'object-predicate';
import BaseObject from './base-object';
import ClientConnection from './connection/base-client';
import { State } from './state';
import { TestDataEvent, TestModule } from './types';

// tslint:disable-next-line:no-namespace
namespace BaseClient {
  export interface Options extends BaseObject.Options {
    connection: ClientConnection;
    enabled?: boolean;
  }
}

abstract class BaseClient extends BaseObject {
  protected enabled: boolean;
  protected testData = new Subject<TestDataEvent>();
  protected conn: ClientConnection;
  private prepareWaiters: { [k: string]: Deferred<void> } = {};
  constructor(opts: BaseClient.Options) {
    super(opts);
    this.enabled = typeof opts.enabled === 'boolean' ? opts.enabled : true;
    this.log.blue.pushPrefix('💻Cl');
    this.conn = opts.connection;
    if (this.enabled) {
      this.conn.setupClient(this);
    }
    this.cleanupOnDestroy.push(() => {
      this.testData.complete();
    });
  }
  // tslint:disable-next-line:no-empty
  async setupConnection(_conn: ClientConnection) {}
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
  async receiveTestData(data: TestDataEvent) {
    this.testData.next(data);
  }
  async runModules(moduleFilter?: PredicateObject<TestModule>) {
    if (!this.enabled) return;
    this.log.bgYellow.blue.pushPrefix('runModules');
    const state = await this.prepareServerFrame(moduleFilter);
    this.log.debug('server frame prepared (id=' + state.id + ')');
    (await this.conn).runTests(state);
    this.log.popPrefix();
  }
  protected async prepareServerFrame(
    moduleFilter?: PredicateObject<TestModule>
  ): Promise<State> {
    const state = await (await this.conn).prepareServer({ data: moduleFilter });
    const d = (this.prepareWaiters[state.id] = new Deferred<void>());
    this.log.white.bgOrangeRed.debug('sessionId = ' + state.id);
    await this.prepareServerFrameImpl(moduleFilter);
    await d.promise;
    return state;
  }
  protected abstract async prepareServerFrameImpl(
    moduleFilter?: PredicateObject<TestModule>
  ): Promise<any>;
}

export default BaseClient;
