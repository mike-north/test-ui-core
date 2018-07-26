import Adapter from './adapter';

export default abstract class TestRunner<A> {
  constructor(protected cfg: A) {}
  // tslint:disable-next-line:no-empty
  async setup(_adapter: Adapter) { }
  // tslint:disable-next-line:no-empty
  async destroy() { }
}
