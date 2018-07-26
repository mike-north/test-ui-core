import { Subject, Subscription } from 'micro-observable';
import { Data } from './types';

export default abstract class CommChannel<T extends Data> {
  protected subj = new Subject<T>();
  abstract async setup(): Promise<void>;
  abstract async destroy(): Promise<void>;
  subscribe(cb: (val: T) => void): Subscription {
    return this.subj.subscribe(cb);
  }
}
