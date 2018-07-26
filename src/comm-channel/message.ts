import { Observable, filter, fromEvent, map } from 'micro-observable';
import CommChannel from '../comm-channel';

export default class MessageCommChannel extends CommChannel<MessageEvent> {
  private obs: Observable<any> = fromEvent<'message'>(window, 'message').pipe(
    filter(evt => evt.data._testFrame !== void 0),
    map(evt => evt.data)
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
