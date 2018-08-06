import { OptionalProps } from '@mike-north/types';
import Penpal from 'penpal';
import BaseServer from '../base-server';
import { State } from '../state';
import { AnyTestDataEvent } from '../types';
import ServerConnection from './base-server';

// tslint:disable-next-line:no-namespace
namespace IFrameServerConnection {
  export interface Options extends ServerConnection.Options {}
  export interface Methods extends ServerConnection.Methods {}
}

class IFrameServerConnection extends ServerConnection {
  constructor(options?: IFrameServerConnection.Options) {
    super(options);
    this.log.darkGray.pushPrefix('IFrame');
  }
  async setupServerImpl(ts: BaseServer) {
    this.log.pushPrefix('setup');
    const methods: IFrameServerConnection.Methods = {
      prepare(partialState: OptionalProps<State, 'id'>): State {
        return ts.prepare(partialState);
      },
      runTests(state: State) {
        return ts.doRunTests(state.data);
      }
    };
    this.log.debug('connecting');
    const conn = Penpal.connectToParent({
      methods
    });
    this.cleanupOnDestroy.push(() => conn.destroy());
    const client = await conn.promise;
    this.log.debug('connected');
    this.log.popPrefix();
    return client;
  }
  async sendTestData(data: AnyTestDataEvent) {
    await (await this.clientConn).receiveTestData(data);
  }
}

export default IFrameServerConnection;
