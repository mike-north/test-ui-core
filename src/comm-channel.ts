import { Subject } from "micro-observable";

  export default abstract class CommChannel<T> {
    protected subj = new Subject<T>();
    abstract async setup(): Promise<void>;
    abstract async destroy(): Promise<void>;
    subscribe(cb: (val: T) => void): Subscription {
      return this.subj.subscribe(cb);
    }
  }