import { Observable, filter, fromEvent, map } from 'micro-observable';
import CommChannel from '../comm-channel';
import { DataPayload } from '../types';

export default class MessageCommChannel extends CommChannel<DataPayload> {
  private obs: Observable<DataPayload> = fromEvent<'message'>(window, 'message').pipe(
    filter(evt => evt.data._testFrame !== void 0),
    map(me => me.data)
  );
  async setup(): Promise<void> {
    this.obs.subscribe(evt => {
      this.subj.next(evt);
    });
  }
  async destroy(): Promise<void> {
    this.subj.complete();
  }
}

declare module '@test-ui/client' {
  export interface CommChannelMap {
    postMessage: MessageCommChannel;
  }
  export interface CommChannelOptionsMap {
    postMessage: null;
  }
}
