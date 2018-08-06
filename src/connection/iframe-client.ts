import Penpal from 'penpal';
import YouAreI from 'youarei';
import BaseClient from '../base-client';
import { State, StateReference } from '../state';
import { AnyTestDataEvent } from '../types';
import ClientConnection from './base-client';
// tslint:disable-next-line:no-namespace
namespace IFrameClientConnection {
  export interface Options extends ClientConnection.Options {
    frame: HTMLIFrameElement;
    baseUrl: string;
  }
  export interface Methods extends ClientConnection.Methods {}
}

class IFrameClientConnection extends ClientConnection {
  private get frameUrl(): string {
    const uri = new YouAreI(this.baseUrl);
    uri.query_merge(this.queryParams);
    return uri.to_string();
  }
  queryParams: { [k: string]: any } = {};
  private frame: HTMLIFrameElement;
  private baseUrl: string;
  constructor(options: IFrameClientConnection.Options) {
    super(options);
    this.log.darkGray.pushPrefix('IFrame');
    this.frame = options.frame;
    this.baseUrl = options.baseUrl;
  }
  async setupConnectionClient(tc: BaseClient) {
    this.log.pushPrefix('setup');
    const client = this;
    const methods: IFrameClientConnection.Methods = {
      async onServerBoot(stateRef?: StateReference) {
        if (stateRef === void 0) {
          await tc.onServerBoot();
        } else {
          client.log.debug(
            'Received indication that server reboot is complete. Passing most recent state back so it may keep going'
          );
          let state = client.prepareStateCache[stateRef.id];
          client.prepareServer(state);
        }
      },
      async onServerPrepared(state: State) {
        await tc.onServerPrepared(state);
      },
      async receiveTestData(data: AnyTestDataEvent) {
        await tc.receiveTestData(data);
      }
    };
    this.log.debug('connecting');
    const conn = Penpal.connectToChild({
      url: this.frameUrl,
      appendTo: this.frame,
      methods
    });
    this.cleanupOnDestroy.push(() => conn.destroy());
    const result = await conn.promise;
    this.log.debug('connected');
    this.log.popPrefix();
    return result;
  }
}

export default IFrameClientConnection;
